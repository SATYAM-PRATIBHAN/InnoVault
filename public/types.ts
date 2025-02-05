export interface Project {
    id : number;
    title: string;
    description: string;
    tags: string[];
    upvotes: number;
    claims: number;
    completed: number;
    status: string;
    creatorEmail: string;
}
