import { Response } from "express";
import { ProtectedRequest } from "../middleware/auth";
import prisma from "../config/db";

export const getSavedJobs = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: "userId is required."});
      return;
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId }
    });

    res.status(200).json({ savedJobs });
    return;

  } catch (err) {
    res.status(500).json({
      message: "Could not retrieve saved jobs.",
      error: (err as Error).message
    });
    return;
  }
}

export const saveJob = async (req: ProtectedRequest, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.user?.id;

    if (!jobId) {
      res.status(400).json({ message: "JobId is required."});
      return;
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId
      }
    });

    res.status(201).json({
      savedJob,
      links: {
        viewAllSavedJobs: "/api/saved-jobs",
        removeSavedJob: `/api/saved-jobs/${savedJob.jobId}`
      }
    });
    return;

  } catch (err) {
    res.status(500).json({
      message: "Could not save job.",
      error: (err as Error).message
    });
    return;
  }
}

export const removeSavedJob = async (req: ProtectedRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    const savedJob = await prisma.savedJob.findUnique({
      where: { userId_jobId: { userId, jobId }}
    });

    if (!savedJob) {
      res.status(404).json({ message: "Saved jobId not found." });
      return;
    }

    await prisma.savedJob.delete({
      where: { userId_jobId: { userId, jobId }}
    })

    res.status(204).json({ message: "Job removed from saved jobs." });
    return;

  } catch (err) {
    res.status(500).json({
      message: "Error removing saved job.",
      error: (err as Error).message
    });
    return;
  }
}
