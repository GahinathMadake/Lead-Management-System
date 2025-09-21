import { Response } from "express";
import { AppError } from "../error/error";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/RequestWithMiddleware";

const prisma = new PrismaClient();

class LeadController {
  constructor() { }

  async createLead(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    const {
      first_name,
      last_name,
      email,
      phone,
      company,
      city,
      state,
      source,
      status,
      score,
      lead_value,
      is_qualified,
      last_activity_at,
    } = req.body;

    // Check if lead with same email already exists for this user
    const existingLead = await prisma.lead.findFirst({
      where: { email, userId },
    });

    if (existingLead) {
      throw new AppError("Lead with this email already exists", 400);
    }

    const newLead = await prisma.lead.create({
      data: {
        first_name,
        last_name,
        email,
        phone,
        company,
        city,
        state,
        source,
        status,
        score,
        lead_value,
        is_qualified,
        last_activity_at: last_activity_at ? new Date(last_activity_at) : null,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Lead Added Successfully"
    });
  }

  async getLeads(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    // Parse pagination params
    let page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 20;

    // Cap limit between 1–100
    if (limit < 1) limit = 1;
    if (limit > 100) limit = 100;

    const skip = (page - 1) * limit;

    // Count total leads
    const total = await prisma.lead.count({
      where: { userId },
    });

    // Fetch leads with pagination
    const leads = await prisma.lead.findMany({
      where: { userId },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    });

    return res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      data: leads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }



  async updateLead(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    const leadId = parseInt(req.params.id);
    const {
      first_name,
      last_name,
      email,
      phone,
      company,
      city,
      state,
      source,
      status,
      score,
      lead_value,
      is_qualified,
      last_activity_at,
    } = req.body;

    // Find existing lead
    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) throw new AppError("Lead not found", 404);
    if (existingLead.userId !== userId) throw new AppError("Forbidden", 403);

    // Check if email is being updated to an email already used by this user
    if (email && email !== existingLead.email) {
      const emailTaken = await prisma.lead.findFirst({
        where: { email, userId },
      });
      if (emailTaken) throw new AppError("Lead with this email already exists", 400);
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        first_name,
        last_name,
        email,
        phone,
        company,
        city,
        state,
        source,
        status,
        score,
        lead_value,
        is_qualified,
        last_activity_at: last_activity_at ? new Date(last_activity_at) : null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully"
    });
  }

  async deleteLead(req: AuthRequest, res: Response) {

    console.log("Delete Lead called");
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    const leadId = parseInt(req.params.id);
    const existingLead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!existingLead) throw new AppError("Lead not found", 404);
    if (existingLead.userId !== userId) throw new AppError("Forbidden", 403);

    await prisma.lead.delete({ where: { id: leadId } });
    return res.status(200).json({ success: true, message: "Lead deleted successfully" });
  }

}

export const leadController = new LeadController();
