import { ReduxAction } from '../../types/reducers'
import Constants from '../../constants/databrowser/ui'
import SharedConstants from '../../constants/databrowser/shared'
import * as Immutable from 'immutable'
import { DataBrowserUIState } from '../../types/databrowser/ui'
import { ActionRowState } from '../../types/databrowser/actionrow'

const initialState: DataBrowserUIState = {
  searchVisible: false,
  newRowActive: false,
  selectedNodeIds: Immutable.List<string>(),
  scrollTop: 0,
  loading: true,
  writing: false,
  actionRow: ActionRowState.NewNode,
  selectedCell: {
    row: -1,
    field: null,
  },
  editing: false,
  searchQuery: null,
}

export function reduceUI(
  state: DataBrowserUIState = initialState,
  action: ReduxAction,
): DataBrowserUIState {
  switch (action.type) {
    case Constants.HIDE_NEW_ROW:
      return {...state, 
        newRowActive: false}
    case Constants.FORCE_SHOW_NEW_ROW:
      return {...state, 
        newRowActive: true}
    case Constants.TOGGLE_NEW_ROW:
      return {...state, 
        newRowActive: !state.newRowActive}
    case Constants.TOGGLE_SEARCH:
      return {...state, 
        searchVisible: !state.searchVisible}
    case Constants.SET_NODE_SELECTION:
      return {...state, 
        selectedNodeIds: action.payload,
        actionRow:
          action.payload.size > 0
            ? ActionRowState.DeleteNode
            : ActionRowState.NewNode}
    case Constants.CLEAR_NODE_SELECTION:
      return {...state, 
        selectedNodeIds: Immutable.List<string>(),
        actionRow: ActionRowState.NewNode}
    case Constants.SELECT_CELL:
      return {...state, 
        selectedCell: action.payload}
    case Constants.UNSELECT_CELL:
      return {...state, 
        selectedCell: {
          row: -1,
          field: null,
        }}
    case Constants.EDIT_CELL:
      return {...state, 
        editing: true,
        selectedCell: action.payload}
    case Constants.STOP_EDIT_CELL:
      return {...state, 
        editing: false}
    case Constants.TOGGLE_NODE_SELECTION:
      const id = action.payload
      if (state.selectedNodeIds.includes(id)) {
        const nodes = state.selectedNodeIds.filter(x => x !== id)
        return {...state, 
          selectedNodeIds: nodes,
          actionRow:
            nodes.size > 0 ? ActionRowState.DeleteNode : ActionRowState.NewNode}
      }
      return {...state, 
        selectedNodeIds: state.selectedNodeIds.push(id), // using Immutable.js push here
        actionRow: ActionRowState.DeleteNode}
    case Constants.SET_SCROLL_TOP:
      return {...state, 
        scrollTop: action.payload}
    case Constants.SET_LOADING:
      return {...state, 
        loading: action.payload}
    case Constants.SET_WRITING:
      return {...state, 
        writing: action.payload}
    case Constants.ACTIVATE_NEW_NODE_ROW:
      return {...state, 
        actionRow: ActionRowState.NewNode}
    case Constants.ACTIVATE_SEARCH_ROW:
      return {...state, 
        actionRow: ActionRowState.Search}
    case Constants.ACTIVATE_DELETE_NODE_ROW:
      return {...state, 
        actionRow: ActionRowState.DeleteNode}
    case SharedConstants.RESET:
      return initialState
  }
  return state
}
