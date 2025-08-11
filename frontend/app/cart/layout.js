import { Metadata } from 'next';

export const metadata = {
  title: 'Καλάθι Αγορών - Πνοή Jewelry',
  description: 'Ελέγξτε τα προϊόντα στο καλάθι σας και προχωρήστε στην ολοκλήρωση της παραγγελίας.',
};

export default function CartLayout({ children }) {
  return children;
}
