"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import useCheckoutStore from '@/lib/store/checkout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const billingSchema = z.object({
  sameAsShipping: z.boolean(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
}).refine((data) => {
  if (data.sameAsShipping) return true;
  
  return (
    data.firstName && data.firstName.length >= 2 &&
    data.lastName && data.lastName.length >= 2 &&
    data.address && data.address.length >= 5 &&
    data.city && data.city.length >= 2 &&
    data.postalCode && data.postalCode.length >= 5 &&
    data.country && data.country.length >= 2
  );
}, {
  message: "Όλα τα πεδία είναι υποχρεωτικά όταν τα στοιχεία χρέωσης διαφέρουν από τα στοιχεία αποστολής",
});

export default function BillingStep() {
  const { billingInfo, shippingInfo, updateBillingInfo } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: billingInfo,
    mode: 'onChange'
  });

  const formData = watch();
  const sameAsShipping = watch('sameAsShipping');

  // Update store when form changes
  useEffect(() => {
    updateBillingInfo(formData);
  }, [formData, updateBillingInfo]);

  // Auto-fill billing with shipping data when sameAsShipping is true
  useEffect(() => {
    if (sameAsShipping) {
      setValue('firstName', shippingInfo.firstName);
      setValue('lastName', shippingInfo.lastName);
      setValue('address', shippingInfo.address);
      setValue('city', shippingInfo.city);
      setValue('postalCode', shippingInfo.postalCode);
      setValue('country', shippingInfo.country);
    }
  }, [sameAsShipping, shippingInfo, setValue]);

  return (
    <Card className="bg-[#232326] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Στοιχεία Χρέωσης</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Same as Shipping Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsShipping"
              checked={sameAsShipping}
              onCheckedChange={(checked) => setValue('sameAsShipping', checked)}
              className="border-gray-600 text-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <Label
              htmlFor="sameAsShipping"
              className="text-white cursor-pointer"
            >
              Τα στοιχεία χρέωσης είναι ίδια με τα στοιχεία αποστολής
            </Label>
          </div>

          {/* Billing Form (shown only when different from shipping) */}
          {!sameAsShipping && (
            <div className="space-y-6 mt-6 p-4 border border-gray-600 rounded-lg">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingFirstName" className="text-white">
                    Όνομα *
                  </Label>
                  <Input
                    id="billingFirstName"
                    {...register('firstName')}
                    className="bg-[#18181b] border-gray-600 text-white focus:border-white"
                    placeholder="Εισάγετε το όνομά σας"
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingLastName" className="text-white">
                    Επώνυμο *
                  </Label>
                  <Input
                    id="billingLastName"
                    {...register('lastName')}
                    className="bg-[#18181b] border-gray-600 text-white focus:border-white"
                    placeholder="Εισάγετε το επώνυμό σας"
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="billingAddress" className="text-white">
                  Διεύθυνση *
                </Label>
                <Input
                  id="billingAddress"
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
                  <Label htmlFor="billingCity" className="text-white">
                    Πόλη *
                  </Label>
                  <Input
                    id="billingCity"
                    {...register('city')}
                    className="bg-[#18181b] border-gray-600 text-white focus:border-white"
                    placeholder="Αθήνα"
                  />
                  {errors.city && (
                    <p className="text-red-400 text-sm">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingPostalCode" className="text-white">
                    Ταχυδρομικός Κώδικας *
                  </Label>
                  <Input
                    id="billingPostalCode"
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
                <Label htmlFor="billingCountry" className="text-white">
                  Χώρα *
                </Label>
                <select
                  id="billingCountry"
                  {...register('country')}
                  className="w-full px-3 py-2 bg-[#18181b] border border-gray-600 rounded-md text-white focus:outline-none focus:border-white"
                >
                  <option value="">Επιλέξτε χώρα</option>
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
            </div>
          )}

          {/* Summary when same as shipping */}
          {sameAsShipping && (
            <div className="bg-[#18181b] border border-gray-600 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Στοιχεία Χρέωσης:</h4>
              <div className="text-gray-300 text-sm space-y-1">
                <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p>{shippingInfo.address}</p>
                <p>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                <p>{shippingInfo.country}</p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
