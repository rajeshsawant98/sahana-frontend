// Type declarations for external libraries that don't have proper TypeScript support

declare module 'supercluster' {
  export interface ClusterFeature {
    geometry: {
      coordinates: [number, number];
    };
    properties: {
      cluster: boolean;
      cluster_id?: number;
      point_count?: number;
      point_count_abbreviated?: string;
    };
  }

  export default class SuperCluster {
    constructor(options?: any);
    load(points: any[]): void;
    getClusters(bbox: number[], zoom: number): ClusterFeature[];
    getChildren(clusterId: number): any[];
    getLeaves(clusterId: number, limit?: number, offset?: number): any[];
    getClusterExpansionZoom(clusterId: number): number;
  }
}

// Extend the global JSX namespace to fix React OAuth types
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}

export {};
