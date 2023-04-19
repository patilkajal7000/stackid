export type DatasetTableDetails = {
    table_id: string;
    table_name: string;
    classification: string;
    last_access_in_30_days: number;
};

export type DatasetTableInsights = {
    id: string;
    name: string;
    num_of_times_exported: number;
    num_of_times_table_accessed: number;
    total_bytes_exported: number;
    tags: any;
};

export type SingleTableColumnDetails = {
    col_id: string;
    col_name: string;
    classification: string;
};

export type DatasetActivityLog = {
    activity: string;
    date: number;
    event_details: string;
    identity: string;
    table_name: string;
};
