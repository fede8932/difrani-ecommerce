interface Props {
  width: string;
}

const Map = ({ width }: Props): React.ReactNode => {
  const mapHtml = `<div style="max-width:100%;overflow:hidden;color:red;width:${width};height:570px;margin-bottom:15px">
      <div id="embed-map-canvas" style="height:100%; width:100%;max-width:100%;">
        <iframe style="height:100%;width:100%;border:0;" frameborder="0" 
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=-34.58864298552418,%20-58.94588623150588+(Difrani)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8">
        </iframe>
      </div>
      <a class="code-for-google-map" rel="nofollow" href="https://www.bootstrapskins.com/themes" id="get-map-data">
        premium bootstrap themes
      </a>
      <style>
        #embed-map-canvas img {
          max-width: none!important;
          background: none!important;
          font-size: inherit;
          font-weight: inherit;
        }
      </style>
    </div>`;

  return <div dangerouslySetInnerHTML={{ __html: mapHtml }} />;
};

export default Map;
