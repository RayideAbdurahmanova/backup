// API Response wrapper
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
    success: boolean;
}

// Pagination
export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// Content Types
export interface Content {
    id: number;
    title: string;
    description?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
    [key: string]: any; // For additional fields
}

export interface CreateContentRequest {
    title: string;
    description?: string;
    imageUrl?: string;
    [key: string]: any;
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {
    id: number;
}

// Error Response
export interface ApiError {
    message: string;
    status: number;
    errors?: {
        field?: string;
        message: string;
    }[];
    timestamp?: string;
    path?: string;
}
