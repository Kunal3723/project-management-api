import crypto from 'crypto';

export const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const generateCachedKey = (req, prefix) => {
    if (req.role !== 'Client' && prefix==='projects')
        return prefix;
    if (prefix === 'project')
        return `project:${req.role}:${req.client_id}:${req.id}`;
    else if (prefix === 'projects')
        return `projects:${req.role}:${req.client_id}`;
}

export const decodeCachedKey = (key) => {
    const arr = key.split(' ');
    return {
        role: arr[1],
        client_id: arr[2],
        project_id: arr[0] === 'projects' ? null : arr[3]
    }
}