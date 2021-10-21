import React from 'react';
import { ConfigProvider, Input, message, Modal, Tooltip } from 'efg-design-rth';
import { ReactEdge } from '@/components/Define/Base/ReactEdge';
import AddRemarks from '@/components/Remarks/AddRemarks';
import { classnames } from 'syfed-ui';
import Remarks from '@/components/Remarks';

export interface ReactNodeProps {
  visible: boolean;
  ModalVisible: boolean;
  onClick: () => void;
  edge: ReactEdge;
}

export default class FilterButton extends React.PureComponent<ReactNodeProps, any> {
  private $btn: any;

  constructor(props) {
    super(props);
    this.state = {
      ModalVisible: false,
      AddRemarksShow: false,
      ButtonShow: false,
      isTool: false,
      settingData: {},
    };
  }

  componentDidMount() {
    this.props.edge?.registerComp(this);
    this.load();
  }

  componentWillUnmount() {
    this.props.edge?.destroyComp(this);
  }

  componentDidUpdate(prevProps: Readonly<ReactNodeProps>, prevState: Readonly<{}>, snapshot?: any) {
    this.load();
  }

  load() {
    const { FilterData }: any = this.props.edge;

    if (!!FilterData) {
      this.setState({ ButtonShow: !!FilterData });
    }
  }

  changeRemakrs(bool) {
    console.log('text')
    this.setState({ AddRemarksShow: bool, isTool: bool })
  }

  FilterButton() {
    const { FilterData } = this.props.edge;
    if (!FilterData) {
      this.setState({ ButtonShow: !this.state.ButtonShow })
    }
  }

  /**
   * 点击保存
   * @param data 仪表盘数据
   * @param formula 仪表盘对象
   */
  onOk(data, formula) {
    console.log('data', data, formula)

    const { edge, onClick } = this.props;
    this.setState({ ModalVisible: false, ButtonShow: false, settingData: data }, () => {
      onClick({ FilterData: data });
    })
    // 暂时为空 等有数据补进去

    // edge?.setData({FilterData: {}});
  }

  Tool() {
    this.setState({
      isTool: !this.state.isTool,
    })
  }

  remarks() {
    console.log('remarks')
  }
  copyCondition(bool) {
    const { edge, onClick } = this.props;

    const FilterData = edge.getData()?.FilterData;
    if (!bool) {
      // 表示已经设置  条件设置  现在是粘贴条件
      const data = sessionStorage.getItem('copyCondition')
      if (!data) {
        message.info('请先复制内容');
        return
      }
      edge.setData(Object.assign({}, edge.getData(), { FilterData: data }));
      this.setState({
        settingData: JSON.parse(data),
      })
      message.info('粘贴成功');
      onClick({ FilterData: sessionStorage.getItem('copyCondition')});
    } else {
      // 复制条件
      sessionStorage.setItem('copyCondition', JSON.stringify(FilterData));
      console.log('复制成功', JSON.stringify(FilterData))
      message.info('复制成功');

    }
  }
  SetModalVisible() {
    const { onChangePop, onClick} = this.props;
    onChangePop()
    // onClick({ FilterData: {a:1} });
    // this.setState({
    //   ModalVisible: true,
    // });
  }
  render() {
    const { onClick, edge } = this.props;
    const { ModalVisible, AddRemarksShow, ButtonShow, isTool, settingData } = this.state;
    const filtered = !!edge?.getData()?.FilterData;
    const FilterData = edge.getData()?.FilterData;
    const explain = edge.getData()?.AddRemarks?.explain || '';
    const InputValue = edge.getData()?.AddRemarks?.InputValue || '';
    return <ConfigProvider>
      <div className={'Filter-Button'}>
        <div className={'filter-btn'} onClick={() => { this.Tool() }} >
          {
            (explain || InputValue) && <Tooltip
              title={<Remarks node={edge} onClick={() => { this.remarks() }} />} placement={'top'}
              color={'#fff'}
            >
              <img draggable={false} src={require('../../../assets/imgs/filter.png')} style={{ width: 14, height: 14 }} />
            </Tooltip>
          }
          {
            (!explain && !InputValue) && <img draggable={false} src={require('../../../assets/imgs/filter.png')} style={{ width: 14, height: 14 }} />
          }
          {filtered && <img
            src={require('../../../assets/imgs/filter-checked.png')}
            draggable={false}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              left: '50%',
              top: '50%',
              margin: '-2px 0 0 -1px',
            }}
          />}
        </div>
        {
          isTool && <div className={'Filter-Button-Tool'}>
            <Tooltip
              title={<span style={{ color: '#333' }}>条件设置</span>} placement={'top'}
              color={'#fff'}
            >
              <div className={classnames('node-icon')} style={{ left: -26, top: -10 }}
                onClick={() => { this.SetModalVisible() }}
              >
                <div className={'change Imgs'} />
              </div>
            </Tooltip>
            <Tooltip
              title={<span style={{ color: '#333' }}>{filtered ? '复制条件': '粘贴条件' }</span>} placement={'top'}
              color={'#fff'}
            >
              <div  className={classnames('node-icon')}  style={{ top: -28, left: 4 }}
                    onClick={() => {this.copyCondition(filtered)}}
              >
                <div className={' copy Imgs'} />
              </div>
            </Tooltip>
            <Tooltip
              title={<AddRemarks node={edge} onClick={() => { this.changeRemakrs(false) }} />} placement={'top'}
              trigger={'click'}
              color={'#fff'}
              visible={AddRemarksShow}
            >
              <div className={classnames('node-icon')} style={{ right: -26, top: -10 }}
                title={'添加备注'}
                onClick={() => { this.changeRemakrs(true) }}
              >
                <div className={' remark Imgs'} />
              </div>
            </Tooltip>
          </div>
        }
      </div>

    </ConfigProvider>;
  }
}
