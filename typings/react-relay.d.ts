/* tslint:disable */
// Type definitions for react-relay 1.1
// Project: https
// by: Tim
// Definitions: https
// Version: 2

declare module "react-relay" {
  import * as React from "react"

  var QueryRenderer: any

  /* Relay ConcreteNode definition */

  export type ConcreteArgument = ConcreteLiteral | ConcreteVariable;
  export type ConcreteArgumentDefinition =
    | ConcreteLocalArgument
    | ConcreteRootArgument;
  /**
   * Represents a single ConcreteRoot along with metadata for processing it at
   * runtime. The persisted `id` (or `text`) can be used to fetch the query,
   * the `fragment` can be used to read the root data (masking data from child
   * fragments), and the `query` can be used to normalize server responses.
   *
   NOTE: The
   * the ConcreteRoot will provide a place to store multiple concrete nodes that
   * are part of the same batch, e.g. in the case of deferred nodes or
   * for streaming connections that are represented as distinct concrete roots but
   * are still conceptually tied to one source query.
   */
  export type ConcreteBatch = {
    kind: 'Batch',
    fragment: ConcreteFragment
    id: string
    key: string
    name: string
    query: ConcreteRoot
    text: string
  };
  export type ConcreteCondition = {
    kind: 'Condition',
    passingValue: boolean
    condition: string
    selections: Array<ConcreteSelection>
  };
  // export type ConcreteFragment = {
  //   argumentDefinitions: Array<ConcreteArgumentDefinition>
  //   kind: 'Fragment',
  //   metadata?: {
  //     key: string
  //   },
  //   name: string
  //   selections: Array
  //   type: string
  // };
  // export type ConcreteFragmentSpread = {
  //   args?: Array<ConcreteArgument>
  //   kind: 'FragmentSpread',
  //   name: string
  // };
  export type ConcreteHandle = ConcreteScalarHandle | ConcreteLinkedHandle;
  export type ConcreteRootArgument = {
    kind: 'RootArgument',
    name: string
    type?: string
  };
  export type ConcreteInlineFragment = {
    kind: 'InlineFragment',
    selections: Array<ConcreteSelection>
    type: string
  };
  export type ConcreteLinkedField = {
    alias?: string
    args?: Array<ConcreteArgument>
    concreteType?: string
    kind: 'LinkedField',
    name: string
    plural: boolean
    selections: Array<ConcreteSelection>
    storageKey?: string
  };
  export type ConcreteLinkedHandle = {
    alias?: string
    args?: Array<ConcreteArgument>
    kind: 'LinkedHandle',
    name: string
    handle: string
    key: string
    filters?: Array<string>
  };
  export type ConcreteLiteral = {
    kind: 'Literal',
    name: string
    type?: string
    value: any
  };
  export type ConcreteLocalArgument = {
    defaultValue: any
    kind: 'LocalArgument',
    name: string
    type: string
  };
  export type ConcreteNode =
    | ConcreteCondition
    | ConcreteLinkedField
    | ConcreteFragment
    | ConcreteInlineFragment
    | ConcreteRoot;
  export type ConcreteRoot = {
    argumentDefinitions: Array<ConcreteLocalArgument>
    kind: 'Root',
    name: string
    operation: 'mutation' | 'query' | 'subscription',
    selections: Array<ConcreteSelection>
  };
  export type ConcreteScalarField = {
    alias?: string
    args?: Array<ConcreteArgument>
    kind: 'ScalarField',
    name: string
    storageKey?: string
  };
  export type ConcreteScalarHandle = {
    alias?: string
    args?: Array<ConcreteArgument>
    kind: 'ScalarHandle',
    name: string
    handle: string
    key: string
    filters?: Array<string>
  };
  export type ConcreteSelection =
    | ConcreteCondition
    | ConcreteField
    | ConcreteFragmentSpread
    | ConcreteHandle
    | ConcreteInlineFragment;
  export type ConcreteVariable = {
    kind: 'Variable',
    name: string
    type?: string
    variableName: string
  };
  export type ConcreteSelectableNode = ConcreteFragment | ConcreteRoot;
  export type GeneratedNode = ConcreteBatch | ConcreteFragment;

  type RelayConcreteNode = {
    CONDITION: 'Condition',
    FRAGMENT: 'Fragment',
    FRAGMENT_SPREAD: 'FragmentSpread',
    INLINE_FRAGMENT: 'InlineFragment',
    LINKED_FIELD: 'LinkedField',
    LINKED_HANDLE: 'LinkedHandle',
    LITERAL: 'Literal',
    LOCAL_ARGUMENT: 'LocalArgument',
    ROOT: 'Root',
    ROOT_ARGUMENT: 'RootArgument',
    SCALAR_FIELD: 'ScalarField',
    SCALAR_HANDLE: 'ScalarHandle',
    VARIABLE: 'Variable',
  };

  /* End Relay ConcreteNode definition */

  /* ConcreteQuery Definition */


  /**
   * @internal
   *
   * Types representing the transformed output of Relay.QL queries.
   */

  /**
   * Ideally this would be a union of Field/Fragment/Mutation/Query/Subscription,
   * but that causes lots of Flow errors.
   */
  export type ConcreteBatchCallVariable = {
    jsonPath: string
    kind: 'BatchCallVariable',
    sourceQueryID: string
  };
  export type ConcreteCall = {
    kind: 'Call',
    metadata: {
      type?: string | null
    },
    name: string
    value?: ConcreteValue | null
  };
  export type ConcreteCallValue = {
    callValue: any
    kind: 'CallValue',
  };
  export type ConcreteCallVariable = {
    callVariableName: string
    kind: 'CallVariable',
  };
  export type ConcreteDirective = {
    args: Array<ConcreteDirectiveArgument>
    kind: 'Directive',
    name: string
  };
  export type ConcreteDirectiveArgument = {
    name: string
    value?: ConcreteDirectiveValue | null
  };
  export type ConcreteDirectiveValue =
    | ConcreteCallValue
    | ConcreteCallVariable
    | Array<ConcreteCallValue | ConcreteCallVariable>;

  export type ConcreteField = {
    alias?: string | null
    calls?: Array<ConcreteCall> | null
    children?: Array<ConcreteSelection | null | undefined> | null
    directives?: Array<ConcreteDirective> | null
    fieldName: string
    kind: 'Field',
    metadata: ConcreteFieldMetadata
    type: string
  };
  export type ConcreteFieldMetadata = {
    canHaveSubselections?: boolean | null
    inferredPrimaryKey?: string | null
    inferredRootCallName?: string | null
    isAbstract?: boolean
    isConnection?: boolean
    isConnectionWithoutNodeID?: boolean
    isFindable?: boolean
    isGenerated?: boolean
    isPlural?: boolean
    isRequisite?: boolean
  };
  export type ConcreteFragment = {
    children?: Array<ConcreteSelection | null | undefined> | null
    directives?: Array<ConcreteDirective> | null
    id: string
    kind: 'Fragment',
    metadata: {
      isAbstract?: boolean
      isPlural?: boolean
      isTrackingEnabled?: boolean
      pattern?: boolean
      plural?: boolean
    },
    name: string
    type: string
  };
  export type ConcreteFragmentMetadata = {
    isAbstract?: boolean
    pattern?: boolean
    plural?: boolean
  };
  export type ConcreteMutation = {
    calls: Array<ConcreteCall>
    children?: Array<ConcreteSelection | null | undefined> | null
    directives?: Array<ConcreteDirective> | null
    kind: 'Mutation',
    metadata: {
      inputType?: string | null
    },
    name: string
    responseType: string
  };
  // export type ConcreteNode = {
  //   children?: Array<ConcreteSelection | null | undefined> | null
  //   directives?: Array<ConcreteDirective> | null
  // };
  export type ConcreteOperationMetadata = {
    inputType?: string | null
  };
  export type ConcreteQuery = {
    calls?: Array<ConcreteCall> | null
    children?: Array<ConcreteSelection | null | undefined> | null
    directives?: Array<ConcreteDirective> | null
    fieldName: string
    isDeferred?: boolean
    kind: 'Query',
    metadata: {
      identifyingArgName?: string | null
      identifyingArgType?: string | null
      isAbstract?: boolean | null
      isPlural?: boolean | null
    },
    name: string
    type: string
  };
  export type ConcreteQueryMetadata = {
    identifyingArgName?: string | null
    identifyingArgType?: string | null
    isAbstract?: boolean | null
    isDeferred?: boolean | null
    isPlural?: boolean | null
  };
  export type ConcreteSubscription = {
    calls: Array<ConcreteCall>
    children?: Array<ConcreteSelection | null | undefined> | null
    directives?: Array<ConcreteDirective> | null
    kind: 'Subscription',
    name: string
    responseType: string
    metadata: {
      inputType?: string | null
    },
  };
  export type ConcreteValue =
    | ConcreteBatchCallVariable
    | ConcreteCallValue
    | ConcreteCallVariable
    | Array<ConcreteCallValue | ConcreteCallVariable>;

  export type ConcreteFragmentSpread = {
    kind: 'FragmentSpread',
    args: Variables
    fragment: ConcreteFragmentDefinition
  };

  /**
   * The output of a graphql-tagged fragment definition.
   */
  export type ConcreteFragmentDefinition = {
    kind: 'FragmentDefinition',
    argumentDefinitions: Array<ConcreteArgumentDefinition>
    node: ConcreteFragment
  };

  export type ConcreteLocalArgumentDefinition = {
    kind: 'LocalArgument',
    name: string
    defaultValue: any
  };

  export type ConcreteRootArgumentDefinition = {
    kind: 'RootArgument',
    name: string
  };

  /**
   * The output of a graphql-tagged operation definition.
   */
  export type ConcreteOperationDefinition = {
    kind: 'OperationDefinition',
    argumentDefinitions: Array<ConcreteLocalArgumentDefinition>
    name: string
    operation: 'mutation' | 'query' | 'subscription',
    node: ConcreteFragment
  };


  /* End ConcreteQuery Definition */


  /* Types for commitMutation */

  export type RangeBehaviors = RangeBehaviorsFunction | RangeBehaviorsObject;

  export type CallValue = (boolean
  | number
  | string
  | {[key: string]: any}
  | Array<any>
    );

  export type DataID = string;
  export type Variables = {[name: string]: any};

  type RangeBehaviorsFunction = (connectionArgs: {
    [argName: string]: CallValue,
  }) => any;
  type RangeBehaviorsObject = {
    [key: string]: any,
  };

  export type RelayMutationConfig =
    | {
    type: 'FIELDS_CHANGE',
    fieldIDs: {[fieldName: string]: DataID | Array<DataID>},
  }
    | {
    type: 'RANGE_ADD',
    parentName?: string,
    parentID?: string,
    connectionInfo?: Array<{
      key: string,
      filters?: Variables,
      rangeBehavior: string,
    }>,
    connectionName?: string,
    edgeName: string,
    rangeBehaviors?: RangeBehaviors,
  }
    | {
    type: 'NODE_DELETE',
    parentName?: string,
    parentID?: string,
    connectionName?: string,
    deletedIDFieldName: string,
  }
    | {
    type: 'RANGE_DELETE',
    parentName?: string,
    parentID?: string,
    connectionKeys?: Array<{
      key: string,
      filters?: Variables,
    }>,
    connectionName?: string,
    deletedIDFieldName: string | Array<string>,
    pathToConnection: Array<string>,
  }
    | {
    type: 'REQUIRED_CHILDREN',
    children: Array<RelayConcreteNode>,
  };


  export type Uploadable = File | Blob;
  export type UploadableMap = {[key: string]: Uploadable};
  export type PayloadError = {
    message: string,
    locations?: Array<{
      line: number,
      column: number,
    }>,
  };

  export interface RecordProxy {
    copyFieldsFrom(source: RecordProxy): void,
    getDataID(): DataID,
    getLinkedRecord(name: string, args?: Variables | null): RecordProxy | null,
    getLinkedRecords(name: string, args?: Variables | null): Array<RecordProxy| null> | null,
    getOrCreateLinkedRecord(
      name: string,
      typeName: string,
      args?: Variables | null,
    ): RecordProxy,
    getType(): string,
    getValue(name: string, args?: Variables | null): any,
    setLinkedRecord(
      record: RecordProxy,
      name: string,
      args?: Variables | null,
    ): RecordProxy,
    setLinkedRecords(
      records: Array<RecordProxy | null>,
    name: string,
    args?: Variables | null,
    ): RecordProxy,
    setValue(value: any, name: string, args?: Variables | null): RecordProxy,
  }

  export interface RecordSourceSelectorProxy {
    create(dataID: DataID, typeName: string): RecordProxy,
    delete(dataID: DataID): void,
    get(dataID: DataID): RecordProxy | null,
    getRoot(): RecordProxy,
    getRootField(fieldName: string): RecordProxy | null,
    getPluralRootField(fieldName: string): Array<RecordProxy | null> | null,
  }

  export type SelectorStoreUpdater = (
    store: RecordSourceSelectorProxy,
    // Actually RelayCombinedEnvironmentTypes#SelectorData, but mixed is
    // inconvenient to access deeply in product code.
    data: any,
  ) => void;

  export type MutationConfig<T> = {
    configs?: Array<RelayMutationConfig>,
    mutation: GraphQLTaggedNode,
    variables: Variables,
    uploadables?: UploadableMap,
    onCompleted?: (response: T, errors: Array<PayloadError> | null | undefined) => void | null,
    onError?: ((error: Error) => void) | null | undefined,
    optimisticUpdater?: SelectorStoreUpdater | null,
    optimisticResponse?: Object,
    updater?: SelectorStoreUpdater | null,
  };

  /* END commitMutation types */


  export type GraphQLTaggedNode =
    (() => ConcreteFragment | ConcreteBatch)
    | {
      modern: () => ConcreteFragment | ConcreteBatch,
      classic: (...args: any[]) => RelayConcreteNode | ConcreteOperationDefinition,
    };
  type GeneratedNodeMap = any

  function createFragmentContainer<T>(
    component: React.ComponentClass<T> | React.StatelessComponent<T>,
    fragmentSpec: GraphQLTaggedNode | GeneratedNodeMap): React.ComponentClass<T>
  function createPaginationContainer<T>(
    component: React.ComponentClass<T> | React.StatelessComponent<T>,
    fragmentSpect: GraphQLTaggedNode | GeneratedNodeMap,
    settings: any
  ): React.ComponentClass<T>
  function createRefetchContainer<T>(
    component: React.ComponentClass<T> | React.StatelessComponent<T>,
    fragmentSpect: GraphQLTaggedNode | GeneratedNodeMap,
    experimentalQuery: any
  ): React.ComponentClass<T>

  export type Environment = any
  type StoreUpdater = any

  export type Disposable = {
    dispose(): void,
  };

  export type CacheConfig = {
    force?: boolean,
    poll?: number,
  };

  /* Types for requestSubscription */
  export type GraphQLSubscriptionConfig = {
    configs?: Array<RelayMutationConfig>,
    subscription: GraphQLTaggedNode,
    variables: Variables,
    onCompleted?: () => void,
    onError?: (error: Error) => void,
    onNext?: (response?: Object) => void,
    updater?: (store: RecordSourceSelectorProxy) => void,
  }

  /* END Types for requestSubscription */

  function commitLocalUpdate(environment: Environment, updater: StoreUpdater): void
  function commitMutation<T>(environment: Environment, config: MutationConfig<T>): Disposable | Promise<any>
  function fetchQuery(environment: Environment, taggedNode: GraphQLTaggedNode, variables: Variables, cacheConfig?: CacheConfig): Promise<any>
  type graphql = (strings: Array<string>) => GraphQLTaggedNode | {
    experimental: (strings: Array<string>) => GraphQLTaggedNode
  }
  function requestSubscription(environment: Environment, config: GraphQLSubscriptionConfig): Disposable

  export interface RelayProp {
    environment: any
    store: any
  }
}
