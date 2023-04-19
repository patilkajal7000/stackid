import { Node } from 'shared/models/GraphModels';
import { GraphNode } from '../graph_node';

export class Internet extends GraphNode {
    constructor(id: string, name: string, type: string, public details: any) {
        super(id, name, type, details);
    }

    getNodeDetails(): Node {
        const nodeDetails = { ...super.getNodeDetails() };
        nodeDetails['type'] = 'Internet';
        if (nodeDetails.nodeType == 'cidr_ipv4') {
            nodeDetails['title'] = 'IPV4';
        } else {
            nodeDetails['title'] = 'IPV6';
        }
        return nodeDetails;
    }
}
