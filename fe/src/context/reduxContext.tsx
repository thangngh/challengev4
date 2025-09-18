import { Provider } from 'react-redux';
import store from '../store/store';
import { PropLayout } from '../types/base';

export function ReduxProvider({
  children,
}: Readonly<PropLayout>) {
  return <Provider store={store}>{children}</Provider>;
}
