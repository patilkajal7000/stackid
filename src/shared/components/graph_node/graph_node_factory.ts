import { GraphNode } from './graph_node';
import { IGraphNode } from './graph_node_interface';
import { APIGateway } from './node_types/api_gatway';
import { Application } from './node_types/application';
import { ApplicationLoadBalancer } from './node_types/application_load_balancer';
import { ClassicLoadBalancer } from './node_types/classic_load_balancer';
import { CloudFrontDistribution } from './node_types/cloud_front_distribution';
import { Internet } from './node_types/internet';
import { Resources } from './node_types/resource';
import { S3Bucket } from './node_types/s3_bucket';

type NodeTypeMapping = { [key: string]: any };

export class GraphNodeFactory {
    static getNode(details: any): IGraphNode {
        const type = details['resource_type'];

        const nodeTypeMapping: NodeTypeMapping = {
            aws_S3: S3Bucket,
            aws_ApplicationLoadBalancer: ApplicationLoadBalancer,
            aws_ClassicLoadBalancer: ClassicLoadBalancer,
            aws_APIGateway: APIGateway,
            aws_CloudFrontDistribution: CloudFrontDistribution,
            userDefinedGroup: Application,
            cidr_ipv4: Internet,
            resource: Resources,
        };
        if (nodeTypeMapping[type]) {
            return this.generateNode(nodeTypeMapping[type], details);
        }
        return this.generateNode(GraphNode, details);
    }

    static generateNode<T extends GraphNode>(
        node: { new (id: string, name: string, type: string, details: any): T },
        details: any,
    ): T {
        const id = details['id'];
        const name = details['name'];
        const type = details['resource_type'];
        return new node(id, name, type, details);
    }
}
