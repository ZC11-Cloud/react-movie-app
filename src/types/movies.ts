export interface Movies {
    id: number;
    title: string;
    poster_path: string;
    poster_url: string;
    vote_average: number;
    release_date: string;
    original_language: string;
}

// 定义 API 响应类型
export interface MovieApiResponse {
    results: Movies[];
    total_results: number;
    total_pages: number;
}

// 定义 Appwrite 的 Document 类型
export interface AppwriteDocument {
    id: string;
    title: string;
    poster_path: string;
    poster_url: string;
    vote_average: number;
    release_date: string;
    original_language: string;
    count: number; // Appwrite 特有字段
}