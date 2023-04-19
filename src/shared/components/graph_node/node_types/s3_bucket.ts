import { Node } from 'shared/models/GraphModels';
import { GraphNode } from '../graph_node';

export class S3Bucket extends GraphNode {
    constructor(id: string, name: string, type: string, public details: any) {
        super(id, name, type, details);
    }

    getNodeDetails(): Node {
        const nodeDetails = { ...super.getNodeDetails() };
        nodeDetails['type'] = 'S3 bucket';
        if (this.details['is_public']) {
            nodeDetails.title = this.details['bucker_url'];
        }
        return nodeDetails;
    }
}
