export interface WorkArea {
    id?: number;
    label: string;
}

export interface WorkAreaDocument {
    id?: number;
    workAreaId: number;
    documentId: number;
}

export interface WorkAreaFormatter {
    id?: number;
    workAreaId: number;
    formatterId: number;
}