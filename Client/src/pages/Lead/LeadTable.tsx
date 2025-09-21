"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { type Lead } from "@/Interfaces/Leads";
import { Button } from "@/components/ui/button";
import { LeadForm } from "./LeadsForm";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from "@/components/ui/pagination";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";


interface LeadTableProps {
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    loading: boolean;
    page: number;
    setPage: (p: number) => void;
    limit: number;
    setLimit: (l: number) => void;
    total: number;
    totalPages: number;
    fetchLeads: () => void;
}

const LeadTable: React.FC<LeadTableProps> = ({
    leads,
    setLeads,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    fetchLeads,
}) => {
    // keep only edit/delete state inside
    const [editLead, setEditLead] = useState<Lead | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [deleteLeadId, setDeleteLeadId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/leads/${id}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setLeads((prev) => prev.filter((lead) => lead.id !== id));
                setDeleteLeadId(null);
                toast.success("Lead deleted successfully");
                fetchLeads(); // refresh after delete
            } else {
                toast.error(res.data.message || "Error deleting lead");
            }
        } catch (error: any) {
            console.error("Failed to delete lead", error);
            toast.error(error.response?.data?.error || "Error deleting lead");
        }
    };


    useEffect(() => {
        fetchLeads();
    }, [page]);

    useEffect(() => {
        setPage(1); // Reset to first page when limit changes
        fetchLeads();
    }, [limit]);

    if (loading) return <p>Loading leads...</p>;

    return (
        <div className="overflow-x-auto space-y-4">
            {/* Row count */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1}–
                    {Math.min(page * limit, total)} of {total} leads
                </p>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <Select
                        value={limit.toString()}
                        onValueChange={(value) => {
                            setPage(1);
                            setLimit(Number(value));
                        }}
                    >
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder={limit} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>


            {/* Table */}
            <table className="table-auto w-full border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Company</th>
                        <th className="p-2 border">City</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!leads || leads.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-4 text-center">
                                <div className="text-center py-20">
                                    <p className="text-lg font-semibold mb-4">No leads found.</p>
                                    <p className="text-gray-500">
                                        Click "Add Lead" to create your first lead.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50">
                                <td className="p-2 border">
                                    {lead.first_name} {lead.last_name}
                                </td>
                                <td className="p-2 border">{lead.email}</td>
                                <td className="p-2 border">{lead.company || "-"}</td>
                                <td className="p-2 border">{lead.city || "-"}</td>
                                <td className="p-2 border">{lead.status}</td>
                                <td className="p-2 border space-x-2">
                                    {/* Edit Dialog */}
                                    <Dialog
                                        open={showEditDialog && editLead?.id === lead.id}
                                        onOpenChange={setShowEditDialog}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditLead(lead);
                                                    setShowEditDialog(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-lg">
                                            <DialogHeader>
                                                <DialogTitle>Edit Lead</DialogTitle>
                                            </DialogHeader>
                                            {editLead && (
                                                <LeadForm
                                                    initialData={editLead}
                                                    onSuccess={() => {
                                                        setShowEditDialog(false);
                                                        fetchLeads();
                                                    }}
                                                />
                                            )}
                                            <div className="flex justify-end mt-4">
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Delete AlertDialog */}
                                    <AlertDialog
                                        open={deleteLeadId === lead.id}
                                        onOpenChange={() => setDeleteLeadId(null)}
                                    >
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. Do you want to
                                                    continue?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <AlertDialogCancel asChild>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setDeleteLeadId(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() =>
                                                            deleteLeadId && handleDelete(deleteLeadId)
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </AlertDialogAction>
                                            </div>
                                        </AlertDialogContent>

                                        {/* Trigger */}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setDeleteLeadId(lead.id)}
                                        >
                                            Delete
                                        </Button>
                                    </AlertDialog>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => page > 1 && setPage(page - 1)}
                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i + 1}>
                            <PaginationLink
                                isActive={page === i + 1}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => page < totalPages && setPage(page + 1)}
                            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default LeadTable;