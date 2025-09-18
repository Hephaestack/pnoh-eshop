import { Metadata } from 'next';

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: 'Καλάθι Αγορών - Πνοή Jewelry',
  description: 'Ελέγξτε τα προϊόντα στο καλάθι σας και προχωρήστε στην ολοκλήρωση της παραγγελίας.',
};

export default function CartLayout({ children }) {
  return children;
}
