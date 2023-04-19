import { Node } from '../../models/GraphModels';

export interface IGraphNode {
    getNodeDetails(): Node;
    setPopoverDetails(details: unknown): unknown;
    getPopoverTemplate(): JSX.Element;
}
