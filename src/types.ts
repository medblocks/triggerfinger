export interface Tree {
    id: string;
    name: string;
    min: number;
    max: number;
    aqlPath: string;
    rmType: string;
    localizedName?: string;
    nodeID?: string;
    inContext?: boolean;
    localizedNames?: {
      [key: string]: string;
    };
    localizedDescriptions?: {
      [key: string]: string;
    };
    annotations?: {
      [key: string]: string;
    };
    children?: Tree[];
  
    [other: string]: any;
    // Added
    path?: string;
    runtimeRegex?: string;
    regex?: string;
    snippet?: string;
    context?: string;
    status?: "present" | "optionalAbsent" | "mandatoryAbsent" | "allPresent";
  }