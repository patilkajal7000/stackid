import { Node } from 'shared/models/GraphModels';
import { IGraphNode } from './graph_node_interface';

export class GraphNode implements IGraphNode {
    id: string;
    name: string;
    nodeType: string;
    iconURL: string;
    subType: string;
    ApplicationCount: any;

    constructor(id: string, name: string, type: string, details: any) {
        this.id = id;
        this.name = name;
        this.nodeType = type;
        this.subType = details?.subtype;
        this.subType = details?.subtype;
        this.ApplicationCount = details?.details;
        this.iconURL = 'awsicons/' + this.nodeType + '.svg';
    }

    getNodeDetails(): Node {
        return {
            id: this.id,
            title: this.name,
            nodeType: this.nodeType,
            subType: this.subType,
            iconURL: this.iconURL,
            ApplicationCount: this.ApplicationCount,
        };
    }
    //TODO:eslint
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setPopoverDetails(details: any): unknown {
        throw new Error('Method not implemented.');
    }

    getPopoverTemplate(): JSX.Element {
        throw new Error('Method not implemented.');
    }
}
