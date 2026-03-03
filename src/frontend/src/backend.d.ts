import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Enquiry {
    studentName: string;
    timestamp: Time;
    contactNumber: string;
    board: Board;
    parentName: string;
    standard: bigint;
}
export enum Board {
    StateBoard = "StateBoard",
    CBSE = "CBSE",
    ICSE = "ICSE"
}
export interface backendInterface {
    getAllEnquiries(): Promise<Array<Enquiry>>;
    getEnquiryCount(): Promise<bigint>;
    submitEnquiry(parentName: string, studentName: string, standard: bigint, board: Board, contactNumber: string): Promise<void>;
}
