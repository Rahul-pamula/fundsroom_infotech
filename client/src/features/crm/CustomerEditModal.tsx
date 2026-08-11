import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { useToast } from '../../hooks/useToast';
import { crmApi } from '../../services/crm.api';
import type { CustomerDetail } from '../../types/crm';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().min(7, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  businessName: z.string().min(2, 'Business name is required'),
  gstNumber: z.string().optional(),
  customerType: z.enum(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR']),
  address: z.string().min(5, 'Address is required'),
  status: z.enum(['LEAD', 'ACTIVE', 'INACTIVE']),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CustomerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerDetail;
}

export function CustomerEditModal({ isOpen, onClose, customer }: CustomerEditModalProps) {
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email,
      businessName: customer.business_name,
      gstNumber: customer.gst_number || '',
      customerType: customer.customer_type,
      address: customer.address,
      status: customer.status,
      followUpDate: customer.follow_up_date ? customer.follow_up_date.split('T')[0] : '',
      notes: customer.notes || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) => crmApi.updateCustomer(customer.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customer.id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      pushToast('Customer updated successfully');
      onClose();
    },
    onError: () => {
      pushToast('Failed to update customer', 'error');
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Customer Details">
      <form className="space-y-4" onSubmit={handleSubmit((values) => updateMutation.mutate(values))}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Contact Name</label>
            <Input {...register('name')} />
            {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Mobile</label>
            <Input {...register('mobile')} />
            {errors.mobile ? <p className="mt-1 text-xs text-rose-600">{errors.mobile.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Email</label>
            <Input {...register('email')} />
            {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Business Name</label>
            <Input {...register('businessName')} />
            {errors.businessName ? <p className="mt-1 text-xs text-rose-600">{errors.businessName.message}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">GST Number</label>
            <Input {...register('gstNumber')} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Customer Type</label>
            <Select {...register('customerType')}>
              <option value="RETAIL">Retail</option>
              <option value="WHOLESALE">Wholesale</option>
              <option value="DISTRIBUTOR">Distributor</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Status</label>
            <Select {...register('status')}>
              <option value="LEAD">Lead</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Next Follow-up</label>
            <Input type="date" {...register('followUpDate')} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Address</label>
          <Textarea rows={2} {...register('address')} />
          {errors.address ? <p className="mt-1 text-xs text-rose-600">{errors.address.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Notes</label>
          <Textarea rows={3} {...register('notes')} />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button className="bg-slate-100 hover:bg-slate-200 !text-slate-700" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={updateMutation.isPending} type="submit">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
