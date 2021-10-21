import React from 'react';
import { ConfigProvider, Button,Input, Modal, Tooltip } from 'efg-design-rth';
import { ReactEdge } from '@/components/Define/Base/ReactEdge';
export interface ReactNodeProps {
  visible: boolean;
  ModalVisible: boolean;
  onClick: () => void;
  edge: ReactEdge;
}
export default class FilterButton extends React.PureComponent<ReactNodeProps> {
  private $btn: any;

  constructor(props) {
    super(props);
    this.state = { visible: false, ModalVisible: false };
  }

  componentDidMount() {
    this.props.edge?.registerComp(this);
  }

  componentWillUnmount() {
    this.props.edge?.destroyComp(this);
  }
  handleClick() {
    const { onClick, edge } = this.props;
    onClick()
  }
  render() {
    return <ConfigProvider>
      <div className={'Filter-Button-Dashed'}>
        <Button style={{ padding:'5px 8px', textAlign: 'center', background: '#fff', color: '#428DF5' }} onClick={() => {this.handleClick()}} className={'ed-btn ed-btn-primary'} >集合运算</Button>
      </div>
    </ConfigProvider>;
  }
}
