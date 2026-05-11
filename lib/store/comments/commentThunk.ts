import { createAsyncThunk } from '@reduxjs/toolkit';
import { Annotation } from '@/components/annotationPlugin';

const tenantHeader = process.env.NEXT_PUBLIC_TENANT_ID;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all comments
export const fetchCommentsThunk = createAsyncThunk(
  'comments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        headers: {
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch comments');
      }
      const data = await response.json();
      return data.pages;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch comments by page
export const fetchCommentsByPageThunk = createAsyncThunk(
  'comments/fetchByPage',
  async (pageId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments?pageId=${pageId}`, {
        headers: {
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch page comments');
      }
      const data = await response.json();
      return data.comments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new comment
export const createCommentThunk = createAsyncThunk(
  'comments/create',
  async (commentData: Partial<Annotation>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create comment');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a comment
export const updateCommentThunk = createAsyncThunk(
  'comments/update',
  async ({ id, commentData }: { id: string; commentData: Partial<Annotation> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
        body: JSON.stringify(commentData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update comment');
      }
      const data = await response.json();
      return data.comment;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
  
// Delete a comment
export const deleteCommentThunk = createAsyncThunk(
  'comments/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: {
          "x-tenant-db": tenantHeader || "",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

