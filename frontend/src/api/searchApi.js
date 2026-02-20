import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
});

export async function checkHealth() {
    const { data } = await API.get('/health');
    return data;
}

export async function semanticSearch(query, topK = 5, threshold = 0.3) {
    const { data } = await API.post('/search', { query, top_k: topK, threshold });
    return data;
}

export async function multiQuerySearch(queries, topK = 5, threshold = 0.3) {
    const { data } = await API.post('/search/multi', { queries, top_k: topK, threshold });
    return data;
}

export async function getDocuments() {
    const { data } = await API.get('/documents');
    return data;
}

export async function addDocument(title, content, metadata = {}) {
    const { data } = await API.post('/documents', { title, content, metadata });
    return data;
}

export async function deleteDocument(docId) {
    const { data } = await API.delete(`/documents/${docId}`);
    return data;
}

export async function loadSampleData() {
    const { data } = await API.post('/sample-data');
    return data;
}

export async function clearData() {
    const { data } = await API.post('/clear');
    return data;
}

export async function getStats() {
    const { data } = await API.get('/stats');
    return data;
}
