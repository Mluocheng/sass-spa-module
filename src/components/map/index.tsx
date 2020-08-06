import React from 'react';
import classNames from 'classnames';
import css from './index.less';
declare const AMap;

export interface MapClickEvent {
  lngLat: {
    lng: number;
    lat: number;
  };
  address: {
    areaCode: string;
    region: string; 
    city: string; 
    area: string;
    detail: string;
  };
}

interface LocationChangeEvent {
  address: string;
  lng: number;
  lat: number;
}

export interface Props {
  className?: string;
  controls?: boolean;
   address?: string;
  onClick?: (event?: MapClickEvent) => void;
  onLocationChange?: (event?: LocationChangeEvent) => void;
}

export default class Map extends React.Component<Props> {

  static defaultProps = {
    controls: true,
    onClick: () => {},
    onLocationChange: () => {},
  };

  map: any;
  toolbar: any;
  geocoder: any;
  lastMarker: any;

  componentDidMount() {
    const { controls, address } = this.props;
    // 初始化地图
    this.map = new AMap.Map('mapContainer', {
      resizeEnable: false,
      zoom: 16
    });
    // 挂载地图插件
    const plugins = ['AMap.Geocoder'];
    if (controls) plugins.push('AMap.ToolBar');
    AMap.plugin(plugins, () => {
      // 异步加载插件
      this.geocoder = new AMap.Geocoder({ city: '' }); // 给地图加点标记
      if (controls) {
        this.toolbar = new AMap.ToolBar(); // 显示地图放大控件
        this.map.addControl(this.toolbar);
      }

      if (address) {
        // this.search(address);
      }
    });

    this.map.on('click', this.handleClick.bind(this));
  }
  
  componentDidUpdate(prevProps: Readonly<Props>) {
    const { address } = this.props;
    if (prevProps.address === address) return;
    this.search(address);
  }

  /**
   * 更具经纬度设置 坐标点
   * @param lng 
   * @param lat 
   */
  setMarker(lng: number, lat: number, title?: string) {

    if (!title) title = this.props.address;

    // 重新定位
    const marker = new AMap.Marker({
      position: new AMap.LngLat(lng, lat),
      title,
    });
    this.map.setCenter(new AMap.LngLat(lng, lat));
    if (this.lastMarker) this.map.remove(this.lastMarker);
    this.map.add(marker);
    this.lastMarker = marker;
  }

  /**
   * 通过文字描述的地址搜索地点
   * @param address 
   */
  search(address: string) {
    this.geocoder.getLocation(address, (status: any, result: any) => {
      if (status === 'complete' && result.info === 'OK') {
        // result中, 第一个对应详细地理坐标信息, 把坐标点打标
        if (result.geocodes.length) {
          const { lng, lat } = result.geocodes[0].location;
          this.props.onLocationChange({ address, lng, lat });

          this.setMarker(lng, lat);
        }
      }
    });
  }

  /**
   * 点击地图时
   * @param e 
   */
  handleClick(e: any) {
    const { onClick } = this.props;
    const { lng, lat } = e.lnglat;
    new AMap.Geocoder({}).getAddress([lng, lat], (status, result) => {
      if (status === 'complete'&&result.regeocode) {
        const { addressComponent, formattedAddress } = result.regeocode;
        const { province, city, district } = addressComponent;
        const detailAddress = formattedAddress.replace(province + city + district, '');
      
        this.setMarker(lng, lat);

        onClick({
          lngLat: { lat, lng },
          address: {
            detail: detailAddress,
            region: province,
            city, 
            area: district,
            areaCode: addressComponent.adcode,
          },
        });
      } else {
        console.error('根据经纬度查询地址失败');
      }
    });
  }

  render() {
    const { className } = this.props;
    return <div id="mapContainer" className={classNames(css.container, className)} />;
  }
}
