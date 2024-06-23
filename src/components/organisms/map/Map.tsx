const Map = (): React.ReactNode => {
  const mapHtml = `<div style="max-width:100%;overflow:hidden;color:red;width:950px;height:570px;margin-bottom:15px">
      <div id="embed-map-canvas" style="height:100%; width:100%;max-width:100%;">
        <iframe style="height:100%;width:100%;border:0;" frameborder="0" 
          src="https://www.google.com/maps/embed/v1/place?q=av.+Don+Bosco+2175,+Morón,+Buenos+Aires&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8">
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
