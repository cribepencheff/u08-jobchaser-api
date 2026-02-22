import { Response } from "express";
import { ProtectedRequest } from "../middleware/auth";
import prisma from "../config/db";

export const getSavedJobs = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ messageKey: "user_id_required" });
      return;
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
    });

    res.status(200).json({ savedJobs });
    return;
  } catch (err) {
    res.status(500).json({
      messageKey: "could_not_retrieve_saved_jobs",
      error: (err as Error).message,
    });
    return;
  }
};

export const saveJob = async (req: ProtectedRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?.id;

    if (!jobId) {
      res.status(400).json({ messageKey: "job_id_required" });
      return;
    }

    const savedJobExists = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (savedJobExists) {
      res.status(409).json({ messageKey: "job_already_saved" });
      return;
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
    });

    res.status(201).json({
      savedJob,
      links: {
        viewAllSavedJobs: "/api/saved-jobs",
        removeSavedJob: `/api/saved-jobs/${savedJob.jobId}`,
      },
    });
    return;
  } catch (err) {
    res.status(500).json({
      messageKey: "unable_to_save_job",
      error: (err as Error).message,
    });
    return;
  }
};

export const removeSavedJob = async (req: ProtectedRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    const savedJob = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (!savedJob) {
      res.status(404).json({ messageKey: "saved_job_id_not_found" });
      return;
    }

    await prisma.savedJob.delete({
      where: { userId_jobId: { userId, jobId } },
    });

    res.status(200).json({
      messageKey: "job_removed_from_saved_jobs",
      links: {
        viewAllSavedJobs: "/api/saved-jobs",
      },
    });
    return;
  } catch (err) {
    res.status(500).json({
      messageKey: "error_removing_saved_job",
      error: (err as Error).message,
    });
    return;
  }
};
