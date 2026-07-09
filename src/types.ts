/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = "en" | "zu" | "xh" | "af" | "st";

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  district: string;
  province: string;
  transitLines: string[]; // e.g. ["Route A", "Soweto-CBD Taxi"]
}

export interface WorkerProfile {
  id: string;
  fullName: string;
  phoneNumber: string; // To be masked until contract accepted
  email: string;
  location: string; // Neighborhood ID
  skills: string[];
  hourlyRate: number; // in ZAR (R)
  availability: "Available" | "Busy" | "Part-time";
  bio: string;
  portfolioPhotos: string[]; // placeholder image paths/descriptions
  avatarUrl?: string; // profile picture for workers
  completedJobsCount: number;
  rating: number;
  isVisible: boolean; // POPIA visibility toggle
}

export interface JobPosting {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  category: string;
  description: string;
  location: string; // Neighborhood ID
  budget: number; // in ZAR (R)
  duration: string; // e.g., "1 Day", "3 Days"
  transitRouteRequired: string[]; // e.g. ["Soweto-CBD Taxi"]
  status: "Open" | "In-Negotiation" | "Accepted" | "Completed";
  acceptedWorkerId?: string;
  clientPhone: string; // To be masked until accepted
}

export interface Message {
  id: string;
  senderId: string;
  senderRole: "worker" | "client";
  receiverId: string;
  content: string;
  timestamp: string;
  isPendingSync?: boolean; // Offline drafting state
  jobId?: string; // Associated job for POPIA contract tracking
}

export interface ContractProposal {
  id: string;
  jobId: string;
  workerId: string;
  clientId: string;
  proposedRate: number;
  workerAccepted: boolean;
  clientAccepted: boolean;
  status: "Pending" | "Accepted" | "Declined";
}

export interface SyncQueueItem {
  id: string;
  type: "CREATE_JOB" | "UPDATE_PROFILE" | "SEND_MESSAGE" | "PROPOSE_CONTRACT" | "ACCEPT_CONTRACT";
  payload: any;
  timestamp: string;
}

export interface UssdSession {
  phoneNumber: string;
  currentMenu: string; // "MAIN", "REGISTER", "FIND_JOBS", "INBOX", "JOB_DETAIL", "CONTRACT"
  inputs: string[];
  history: string[];
}
