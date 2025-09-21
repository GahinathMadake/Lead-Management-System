"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { type Lead } from "@/Interfaces/Leads";
import { LeadSources, LeadStatuses } from "@/Interfaces/Leads";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  onSuccess: () => void;
  initialData?: Partial<Lead>;
};

export const LeadForm: React.FC<Props> = ({ onSuccess, initialData }) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Partial<Lead>>({
    defaultValues: initialData ?? {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      city: "",
      state: "",
      source: "website",
      status: "new",
      score: 0,
      lead_value: 0,
      is_qualified: false,
    },
  });

  const onSubmit = async (data: Partial<Lead>) => {
    setSubmitting(true);
    try {
      if(initialData?.id) {
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/leads/${initialData.id}`, data, {
          withCredentials: true,
        });
        if(res.data.success){
            toast.success("Lead updated successfully!");
            form.reset();
            onSuccess();
        }
        else {
            toast.error("Error updating lead");
        }
      } 
      else {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/leads/add-lead`, data, {
          withCredentials: true,
        });

        if(res.data.success){
            toast.success("Lead created successfully!");
            form.reset();
            onSuccess();
        }
        else{
            toast.error("Error updating lead");
        }
      }
    } catch (error: any) {
      console.error("Failed to save lead", error);
      toast.error(error?.response?.data?.error || "Error saving lead");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input {...form.register("first_name", { required: true })} disabled={submitting} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input {...form.register("last_name", { required: true })} disabled={submitting} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input type="email" {...form.register("email", { required: true })} disabled={submitting} />
        </div>
        <div>
          <Label>Phone</Label>
          <Input {...form.register("phone")} disabled={submitting} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Company</Label>
          <Input {...form.register("company")} disabled={submitting} />
        </div>
        <div>
          <Label>City</Label>
          <Input {...form.register("city")} disabled={submitting} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>State</Label>
          <Input {...form.register("state")} disabled={submitting} />
        </div>
        <div>
          <Label>Score</Label>
          <Input type="number" {...form.register("score", { valueAsNumber: true })} disabled={submitting} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Lead Value</Label>
          <Input type="number" {...form.register("lead_value", { valueAsNumber: true })} disabled={submitting} />
        </div>
        <div>
          <Label>Qualified</Label>
          <Switch {...form.register("is_qualified")} disabled={submitting} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Source</Label>
          <Select {...form.register("source")} disabled={submitting}>
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {LeadSources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select {...form.register("status")} disabled={submitting}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {LeadStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : initialData?.id ? "Update Lead" : "Add Lead"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={submitting}
          onClick={() => form.reset()}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};
