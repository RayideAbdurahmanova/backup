/**
 * API Usage Examples
 * 
 * This file demonstrates how to use the API service in your React Native components
 */

import { apiService, handleApiError, Content } from '../api';

// ==================== Content API Examples ====================

/**
 * Example 1: Fetch all content with pagination
 */
export const fetchContentExample = async () => {
    try {
        const content = await apiService.getAllContent({
            page: 0,
            size: 10,
            sort: 'createdAt,desc',
        }, 'az');
        console.log('Content:', content);
        return content;
    } catch (error) {
        console.error('Error fetching content:', handleApiError(error));
        throw error;
    }
};

/**
 * Example 2: Get single content by ID
 */
export const getContentByIdExample = async (contentId: number) => {
    try {
        const content = await apiService.getContentById(contentId, 'az');
        console.log('Content:', content);
        return content;
    } catch (error) {
        console.error('Error fetching content:', handleApiError(error));
        throw error;
    }
};

/**
 * Example 3: Create new content
 */
export const createContentExample = async () => {
    try {
        const newContent = await apiService.createContent({
            title: 'New Content',
            description: 'This is a new content item',
            imageUrl: 'https://example.com/image.jpg',
        }, 'az');
        console.log('Created content:', newContent);
        return newContent;
    } catch (error) {
        console.error('Error creating content:', handleApiError(error));
        throw error;
    }
};

/**
 * Example 4: Update existing content
 */
export const updateContentExample = async (contentId: number) => {
    try {
        const updatedContent = await apiService.updateContent(contentId, {
            id: contentId,
            title: 'Updated Title',
            description: 'Updated description',
        }, 'az');
        console.log('Updated content:', updatedContent);
        return updatedContent;
    } catch (error) {
        console.error('Error updating content:', handleApiError(error));
        throw error;
    }
};

/**
 * Example 5: Partially update content
 */
export const patchContentExample = async (contentId: number) => {
    try {
        const patchedContent = await apiService.patchContent(contentId, {
            title: 'New Title Only',
        }, 'az');
        console.log('Patched content:', patchedContent);
        return patchedContent;
    } catch (error) {
        console.error('Error patching content:', handleApiError(error));
        throw error;
    }
};

/**
 * Example 6: Delete content
 */
export const deleteContentExample = async (contentId: number) => {
    try {
        await apiService.deleteContent(contentId, 'az');
        console.log('Content deleted successfully');
    } catch (error) {
        console.error('Error deleting content:', handleApiError(error));
        throw error;
    }
};

/**
 * Example 7: Search content
 */
export const searchContentExample = async (query: string) => {
    try {
        const results = await apiService.searchContent(query, {
            page: 0,
            size: 20,
        }, 'az');
        console.log('Search results:', results);
        return results;
    } catch (error) {
        console.error('Error searching content:', handleApiError(error));
        throw error;
    }
};
