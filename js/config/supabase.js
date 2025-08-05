// Supabase Configuration
class SupabaseConfig {
    constructor() {
        this.supabaseUrl = 'https://tuynmneszvffqbchwmyl.supabase.co';
        this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1eW5tbmVzenZmZnFiY2h3bXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzA3MDksImV4cCI6MjA2OTkwNjcwOX0.PPyc98VfQcwRKOSc8YDPW9K4b8NanwfkoFt3nP63p1c';
        this.supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1eW5tbmVzenZmZnFiY2h3bXlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMzMDcwOSwiZXhwIjoyMDY5OTA2NzA5fQ.Rn7LDSLwANfiMbwpclGQ84GRnOUqQ0RDiLSqnahczGU';
        
        this.init();
    }

    init() {
        // Load Supabase client if available
        if (typeof window !== 'undefined' && window.supabase) {
            this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
        } else {
            // Fallback to fetch API for direct HTTP requests
            this.client = null;
        }
    }

    // Get Supabase client
    getClient() {
        return this.client;
    }

    // Make direct HTTP request to Supabase REST API
    async request(endpoint, options = {}) {
        const url = `${this.supabaseUrl}/rest/v1/${endpoint}`;
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${this.supabaseAnonKey}`
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Supabase request failed:', error);
            throw error;
        }
    }

    // Insert data
    async insert(table, data) {
        return this.request(table, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Select data with optional filters
    async select(table, select = '*', filters = {}) {
        let url = `${table}?select=${select}`;
        
        // Add filters
        Object.keys(filters).forEach((key, index) => {
            const separator = index === 0 ? '&' : '&';
            url += `${separator}${key}=eq.${filters[key]}`;
        });
        
        return this.request(url);
    }

    // Update data
    async update(table, data, filters = {}) {
        let url = table;
        
        // Add filters
        Object.keys(filters).forEach((key, index) => {
            const separator = index === 0 ? '?' : '&';
            url += `${separator}${key}=eq.${filters[key]}`;
        });
        
        return this.request(url, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    // Delete data
    async delete(table, filters = {}) {
        let url = table;
        
        // Add filters
        Object.keys(filters).forEach((key, index) => {
            const separator = index === 0 ? '?' : '&';
            url += `${separator}${key}=eq.${filters[key]}`;
        });
        
        return this.request(url, {
            method: 'DELETE'
        });
    }

    // Real-time subscription (placeholder for future implementation)
    subscribe(table, callback) {
        console.log(`Subscribing to ${table} changes`);
        // This would be implemented with WebSocket connection
        // For now, we'll use polling or manual refresh
    }
}

// Create global instance
window.supabaseConfig = new SupabaseConfig(); 