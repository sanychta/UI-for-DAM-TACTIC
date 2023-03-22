export interface HttpError {
  message: string;
  statusCode: number;
}

export interface IImage {
    name: string;
    url: string;
}

export interface ILogindata {
  id: number;
  code: string;
  login: string;
  password: string;
  upn: string;
  login_group: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  phone_number: string;
  department: string;
  namespace: string;
  snapshot: string;
  s_status: string;
  project_code : string;
  license_type: string;
  hourly_wage: number;
  login_attempt: number;
  location: string;
  keywords: string;
  keywords_data: string;
  data: string;
  image: IImage;
}

export interface IFile {
    name: string;
    percent: number;
    size: number;
    status: "error" | "success" | "done" | "uploading" | "removed";
    type: string;
    uid: string;
    url: string;
}

export interface IAssetsCategory {
    id: number;
    name: string;
    code: string;
    description: string;
    keywords: string;
    login: string;
    s_status: string;
    timestamp: Date;
    image: IImage;
}

export interface IAssets {
    id: number;
    code: string;
    description: string;
    timestamp: string;
    s_status: string;
    keywords: string;
    login: string;
    name: string;
    assets_category_code: string;
    assets_category: IAssetsCategory;
    pipeline_code: string;
    texture_drop: string;
    relative_dir: string;
    file_url: string;
    image: IImage;
}

export interface ILoginGroup {
    id : number;
    code : string;
    login_group : string;
    name : string;
    sub_group : string;
    access_rules : string;
    relative_url : string;
    namespace : string; 
    description : string;
    project_code : string;
    s_status : string;
    start_link : string;
    access_level : string;
    is_default : boolean;
    data : json;
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    gender: string;
    gsm: string;
    createdAt: string;
    isActive: boolean;
    avatar: IFile[];
    addresses: IAddress[];
}

export interface IUserFilterVariables {
    code: string;
    login_group: string;
}

export interface ILoginInGroup{
    id: number;
    code: string;
    login: string;
    login_group: string;
}

export interface IScenes {
    code: string;
    description: string;
    timestamp: Date;
    s_status: string;
    pipeline_code: string;
    episodes_code: string;
    sequence_code: string;
    keywords: string;
    login: string;
    id: number;
    name: string;
    assets_drop: string;
    detail: string;
    script: string;
    duration: string;
    storyboard: string;
    image: IImage;
    assets: string;
}

export interface ITask {
    id: number;
    assigned: string;
    description: string;
    status: string;
    discussion: string;
    bid_start_date: string;
    bid_end_date: string;
    bid_duration: number;
    actual_start_date: Date;
    actual_end_date: Date;
    search_type: string;
    search_id: number;
    timestamp: Date;
    s_status: string;
    priority: number;
    process: string;
    context: string;
    milestone_code: string;
    pipeline_code: string;
    parent_id: number;
    sort_order: number;
    depend_id: number;
    project_code: string;
    supervisor: string;
    code: string;
    login: string;
    completion: number;
    bid_quality: number;
    actual_quality: number;
    actual_duration: number;
    search_code: string;
    data: string;
    parent_name: string;
    task_type: string;
    parent_task_code: string;
    assigned_group: string;
}

export interface ILoginInfo {
    code?: string;
    login?: string;
    name?: string;
    phone_number?: string;
    email?: string;
    id?: number;
    image?: string;
    user_groups?: string;
    ticket?: string;
    // password?: string;
    role?: string;
}

export interface IDuration {
    duration: string;
}

export interface IPipeline {
    id: number;
    code: string;
    pipeline: string;
    timestamp: string;
    search_type: string;
    project_code: string;
    description: string;
    color: string;
    s_status: string;
    autocreate_tasks: boolean;
    name: string;
    parent_process: string;
    type: string;
    category: string;
    version: number;
    parent_code: string;
    use_workflow: boolean;
    data: JSON;
    label?: string;
    task_pipeline?: string;
}

