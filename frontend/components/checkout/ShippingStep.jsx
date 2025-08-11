"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@clerk/nextjs';

import useCheckoutStore from '@/lib/store/checkout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const shippingSchema = z.object({
  firstName: z.string().min(2, 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες'),
  lastName: z.string().min(2, 'Το επώνυμο πρέπει να έχει τουλάχιστον 2 χαρακτήρες'),
  email: z.string().email('Μη έγκυρη διεύθυνση email'),
  phone: z.string().min(10, 'Μη έγκυρος αριθμός τηλεφώνου'),
  address: z.string().min(5, 'Η διεύθυνση πρέπει να έχει τουλάχιστον 5 χαρακτήρες'),
  city: z.string().min(2, 'Η πόλη πρέπει να έχει τουλάχιστον 2 χαρακτήρες'),
  postalCode: z.string().min(5, 'Μη έγκυρος ταχυδρομικός κώδικας'),
  country: z.string().min(2, 'Επιλέξτε χώρα'),
});

export default function ShippingStep() {
  const { user } = useUser();
  const { shippingInfo, updateShippingInfo } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingInfo,
    mode: 'onChange'
  });

  const formData = watch();

  // Auto-fill with Clerk user data
  useEffect(() => {
    if (user && !shippingInfo.email) {
      setValue('email', user.primaryEmailAddress?.emailAddress || '');
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
    }
  }, [user, setValue, shippingInfo.email]);

  // Update store when form changes
  useEffect(() => {
    if (isValid) {
      updateShippingInfo(formData);
    }
  }, [formData, isValid, updateShippingInfo]);

  return (
    <Card className="bg-[#232326] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Στοιχεία Αποστολής</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                Όνομα *
              </Label>
              <Input
                id="firstName"
                {...register('firstName')}
                className="bg-[#18181b] border-gray-600 text-white focus:border-white"
                placeholder="Εισάγετε το όνομά σας"
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Επώνυμο *
              </Label>
              <Input
                id="lastName"
                {...register('lastName')}
                className="bg-[#18181b] border-gray-600 text-white focus:border-white"
                placeholder="Εισάγετε το επώνυμό σας"
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className="bg-[#18181b] border-gray-600 text-white focus:border-white"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Τηλέφωνο *
              </Label>
              <Input
                id="phone"
                {...register('phone')}
                className="bg-[#18181b] border-gray-600 text-white focus:border-white"
                placeholder="+30 6900000000"
              />
              {errors.phone && (
                <p className="text-red-400 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-white">
              Διεύθυνση *
            </Label>
            <Input
              id="address"
              {...register('address')}
              className="bg-[#18181b] border-gray-600 text-white focus:border-white"
              placeholder="Οδός και αριθμός"
            />
            {errors.address && (
              <p className="text-red-400 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-white">
                Πόλη *
              </Label>
              <Input
                id="city"
                {...register('city')}
                className="bg-[#18181b] border-gray-600 text-white focus:border-white"
                placeholder="Αθήνα"
              />
              {errors.city && (
                <p className="text-red-400 text-sm">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-white">
                Ταχυδρομικός Κώδικας *
              </Label>
              <Input
                id="postalCode"
                {...register('postalCode')}
                className="bg-[#18181b] border-gray-600 text-white focus:border-white"
                placeholder="12345"
              />
              {errors.postalCode && (
                <p className="text-red-400 text-sm">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="text-white">
              Χώρα *
            </Label>
            <select
              id="country"
              {...register('country')}
              className="w-full px-3 py-2 bg-[#18181b] border border-gray-600 rounded-md text-white focus:outline-none focus:border-white"
            >
              <option value="Greece">Ελλάδα</option>
              <option value="Cyprus">Κύπρος</option>
              <option value="Germany">Γερμανία</option>
              <option value="France">Γαλλία</option>
              <option value="Italy">Ιταλία</option>
              <option value="Spain">Ισπανία</option>
              <option value="Netherlands">Ολλανδία</option>
              <option value="Belgium">Βέλγιο</option>
              <option value="Austria">Αυστρία</option>
              <option value="Other">Άλλη χώρα</option>
            </select>
            {errors.country && (
              <p className="text-red-400 text-sm">{errors.country.message}</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
