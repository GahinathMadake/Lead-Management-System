"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { LeadForm } from "./Lead/LeadsForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import LandingPageLayout from "@/components/common/LandingPageLayout";
import LeadTable from "./Lead/LeadTable";
import { type Lead } from "@/Interfaces/Leads";
import { toast } from "react-toastify";

export default function LeadsPage() {
  const [open, setOpen] = useState(false);

  // Lifted state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/leads/get-leads`,
        {
          withCredentials: true,
          params: { page, limit },
        }
      );
      if (res.data.success) {
        setLeads(res.data.data);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      } else {
        toast.error("Error fetching leads");
        setLeads([]);
      }
    } catch (error) {
      console.error("Error fetching leads", error);
      toast.error("Error fetching leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, limit]);

  return (
    <LandingPageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Leads</h1>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)}>+ Add Lead</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>

              <LeadForm
                onSuccess={() => {
                  setOpen(false);
                  fetchLeads(); // refresh after adding
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="my-2" />

        <LeadTable
          leads={leads}
          setLeads={setLeads}
          loading={loading}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          total={total}
          totalPages={totalPages}
          fetchLeads={fetchLeads}
        />
      </div>
    </LandingPageLayout>
  );
}
