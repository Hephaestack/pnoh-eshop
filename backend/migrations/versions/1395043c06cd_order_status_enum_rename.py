"""order status enum rename

Revision ID: 1395043c06cd
Revises: 61aae706fb85
Create Date: 2025-09-11 15:21:25.888096

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1395043c06cd'
down_revision: Union[str, Sequence[str], None] = '61aae706fb85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1) Create the new enum with the *correct* English values
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'order_status_new'
            ) THEN
                CREATE TYPE order_status_new AS ENUM ('pending','sent','fulfilled','cancelled','paid');
            END IF;
        END
        $$;
    """)

    # 2) Cast orders.status to text so it's detached from the old enum type
    op.execute("""
        ALTER TABLE orders
        ALTER COLUMN status TYPE text USING status::text;
    """)

    # 3) Normalize existing text values (handle typos & any Greek remnants)
    op.execute("""
        UPDATE orders
        SET status = CASE
            WHEN status IN ('fulfilled','pending','sent','cancelled','paid') THEN status
            WHEN status = 'fullfilled' THEN 'fulfilled'
            WHEN status = 'Εκκρεμής'   THEN 'pending'
            WHEN status = 'Απεσταλμένη' THEN 'sent'
            WHEN status = 'Ολοκληρωμένη' THEN 'fulfilled'
            WHEN status = 'Ακυρωμένη'   THEN 'cancelled'
            WHEN status = 'Πληρωμένη'   THEN 'paid'
            ELSE 'pending'
        END;
    """)

    # 4) Convert the column to the new enum
    op.execute("""
        ALTER TABLE orders
        ALTER COLUMN status TYPE order_status_new USING status::order_status_new;
    """)

    # 5) Drop old enum and rename the new one to the canonical name `order_status`
    op.execute("""
        DO $$
        BEGIN
            -- old enum might be named 'order_status' (or something else from prior migrations)
            IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
                DROP TYPE order_status;
            END IF;
        END
        $$;
    """)

    op.execute("ALTER TYPE order_status_new RENAME TO order_status;")


def downgrade() -> None:
    # Reverse: create a downgrade enum, cast to text, map back, then swap types.
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'order_status_old'
            ) THEN
                -- You can choose what you want to restore here; we'll mirror english values for simplicity
                CREATE TYPE order_status_old AS ENUM ('pending','sent','fulfilled','cancelled','paid');
            END IF;
        END
        $$;
    """)

    op.execute("""
        ALTER TABLE orders
        ALTER COLUMN status TYPE text USING status::text;
    """)

    op.execute("""
        UPDATE orders
        SET status = CASE
            WHEN status IN ('fulfilled','pending','sent','cancelled','paid') THEN status
            ELSE 'pending'
        END;
    """)

    op.execute("""
        ALTER TABLE orders
        ALTER COLUMN status TYPE order_status_old USING status::order_status_old;
    """)

    op.execute("""
        DROP TYPE IF EXISTS order_status;
        ALTER TYPE order_status_old RENAME TO order_status;
    """)
