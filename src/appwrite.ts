import { Client, Databases, ID, Query } from "appwrite";
import type { Movies } from "./types/movies.ts";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID);
const databases = new Databases(client);

export const updateSearchCount = async (searchTerm: string, movie: Movies) => {
    // 1. 使用Appwrite的API查询数据库中是否存在该搜索记录
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal("searchTerm", searchTerm)]
        );
        // 2. 如果再数据库中存在，则更新
        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    count: doc.count + 1,
                }
            );
        }
        // 3. 如果不存在，则插入
        else {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                }
            );
        }
    } catch (error) {
        console.error("Error updating search count:", error);
    }
};
