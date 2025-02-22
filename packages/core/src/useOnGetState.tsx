import * as React from 'react';
import NavigationBuilderContext from './NavigationBuilderContext';
import { NavigationState } from './types';
import NavigationRouteContext from './NavigationRouteContext';

export default function useOnGetState({
  getStateForRoute,
  getState,
}: {
  getStateForRoute: (routeName: string) => NavigationState | undefined;
  getState: () => NavigationState;
}) {
  const { addStateGetter } = React.useContext(NavigationBuilderContext);
  const route = React.useContext(NavigationRouteContext);
  const key = route ? route.key : 'root';

  const getter = React.useCallback(() => {
    const state = getState();
    return {
      ...state,
      routes: state.routes.map(route => ({
        ...route,
        state: getStateForRoute(route.key),
      })),
    };
  }, [getState, getStateForRoute]);

  React.useEffect(() => {
    return addStateGetter && addStateGetter(key, getter);
  }, [addStateGetter, getter, key]);
}
