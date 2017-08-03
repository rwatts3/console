import { ReduxAction } from '../../types/reducers'
import Constants from '../../constants/databrowser/data'
import SharedConstants from '../../constants/databrowser/shared'
import * as Immutable from 'immutable'
import { DataBrowserDataState } from '../../types/databrowser/data'

export const initialState: DataBrowserDataState = {
  nodes: Immutable.List<Immutable.Map<string, any>>(),
  backup: {
    nodes: Immutable.List<Immutable.Map<string, any>>(),
    itemCount: 0,
    loaded: Immutable.List<boolean>(),
  },
  orderBy: {
    fieldName: 'id',
    order: 'DESC',
  },
  filter: Immutable.Map<string, any>(),
  itemCount: 0,
  loaded: Immutable.List<boolean>(),
  mutationActive: false,
  newRowShown: false,
  countChanges: Immutable.Map<string, number>(),
}

export function reduceData(
  state: DataBrowserDataState = initialState,
  action: ReduxAction,
): DataBrowserDataState {
  switch (action.type) {
    case Constants.SET_ORDER:
      return { ...state, orderBy: action.payload }
    case Constants.SET_FILTER:
      const { fieldName, value } = action.payload
      return {
        ...state,
        filter: state.filter.set(fieldName, value),
      }
    case Constants.SET_NEW_ROW_SHOWN:
      return {
        ...state,
        newRowShown: true,
      }
    case Constants.SET_ITEMCOUNT:
      return {
        ...state,
        itemCount: action.payload,
      }
    case Constants.SET_DATA:
      const { nodes, loaded } = action.payload
      return {
        ...state,
        nodes,
        loaded,
      }
    case Constants.SET_NODES:
      return {
        ...state,
        nodes: action.payload,
      }
    case Constants.SET_LOADED:
      return {
        ...state,
        loaded: action.payload,
      }
    case Constants.MUTATION_REQUEST:
      return {
        ...state,
        backup: {
          nodes: state.nodes,
          itemCount: state.itemCount,
          loaded: state.loaded,
        },
        mutationActive: true,
      }
    case Constants.MUTATION_ERROR:
      return {
        ...state,
        nodes: state.backup.nodes,
        itemCount: state.backup.itemCount,
        loaded: state.backup.loaded,
        mutationActive: false,
      }
    case Constants.MUTATION_SUCCESS:
      return {
        ...state,
        mutationActive: false,
        backup: {
          nodes: Immutable.List<Immutable.Map<string, any>>(),
          itemCount: 0,
          loaded: Immutable.List<boolean>(),
        },
      }
    case Constants.INCREASE_COUNT_CHANGE:
      return {
        ...state,
        countChanges: state.countChanges.set(
          action.payload,
          (state.countChanges.get(action.payload) || 0) + 1,
        ),
      }
    case Constants.DECREASE_COUNT_CHANGE:
      return {
        ...state,
        countChanges: state.countChanges.set(
          action.payload,
          (state.countChanges.get(action.payload) || 0) - 1,
        ),
      }
    case Constants.RESET_COUNT_CHANGE:
      return {
        ...state,
        countChanges: Immutable.Map<string, number>(),
      }
    case Constants.ADD_NODE_REQUEST:
      return {
        ...state,
        nodes: state.nodes.unshift(action.payload),
        loaded: state.loaded.unshift(true),
        itemCount: state.itemCount + 1,
      }
    case Constants.ADD_NODE_SUCCESS:
      return {
        ...state,
        nodes: state.nodes.set(0, action.payload),
      }
    case Constants.DELETE_NODES:
      const newState = {
        ...state,
        nodes: state.nodes.filter(
          (node, index) => action.payload.indexOf(node.get('id')) === -1,
        ) as any,
        itemCount: state.itemCount - action.payload.length,
        loaded: state.loaded.slice(
          0,
          state.loaded.size - action.payload.length,
        ) as any,
      }
      return newState
    case Constants.UPDATE_CELL:
      // use block as we would redefine `value` in the same block again
      const { position } = action.payload
      const cellValue = action.payload.value
      return {
        ...state,
        nodes: state.nodes.setIn([position.row, position.field], cellValue),
      }
    case SharedConstants.RESET:
      return initialState
  }
  return state
}
