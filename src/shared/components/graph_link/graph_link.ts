import { IGraphLink } from './graph_link_interface';
import { UserGroupToUserGroup } from './link_type/usergroup_to_usergroup';

export class GraphLink implements IGraphLink {
    id: string;
    source: string;
    target: string;
    label?: string;
    type?: string = 'smoothstep';
    arrowHeadType?: string = 'arrowclosed';
    animated?: boolean = false;
    style?: any = { stroke: '#d76c41' };
    labelBgStyle?: any = { fill: '#d76c41', color: '#ffffff', opacity: '0.7', cursor: 'pointer' };
    labelStyle?: any = { fill: '#fff', fontWeight: 700, cursor: 'pointer' };
    data?: {
        accessType: string;
        access: string;
        sourceType: string;
        targetType: string;
        linkObj: GraphLink;
    };

    constructor(details: any) {
        this.id = details.id;
        this.source = details.source;
        this.target = details.target;
        this.label = details.mapping_description;
        this.data = {
            access: details.access,
            accessType: details.mapping_type,
            sourceType: details.source_type,
            targetType: details.target_type,
            linkObj: this,
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

export class GraphLinkFactory {
    static getLink(details: any): IGraphLink {
        const type = details['mapping_type'];
        if (type == 'userGroupToUserGroup') {
            return new UserGroupToUserGroup(details);
        }
        return new GraphLink(details);
    }
}
