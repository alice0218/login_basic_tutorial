var Cesium;
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNzViZTYzYS04M2ZhLTRkYzYtYWQ3NS00YzBmMzFmNjI3OTUiLCJpZCI6MjgyODYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTEwMTc2MDd9.xTdVGAz5IPlh8bDqJZRZV0FNz5skYqDbljeOZR1LTK8";
var viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: Cesium.IonResource.fromAssetId(1)
  }),
  // infoBox: false,
  // selectionIndicator: false,
  timeline: false,
  animation: false,
  shouldAnimate: true,
  shadow: false,
  geocoder: false,
  homeButton: false,
  baseLayerPicker: true,
  navigationHelpButton: false,
  sceneModePicker: false,
  
});
viewer._cesiumWidget._creditContainer.style.display = "none";
var scene = viewer.scene;



function loadTileset(url) {

  let tileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: url,
      
    })
  );

  //點雲大小調整/////////////////////////////////////////////////////////
  return tileset.readyPromise
    .then(function() {
      tileset.readyPromise
        .then(function() {
          viewer.zoomTo(tileset);

          // Apply the default style if it exists
          var extras = tileset.asset.extras;
          if (
            Cesium.defined(extras) &&
            Cesium.defined(extras.ion) &&
            Cesium.defined(extras.ion.defaultStyle)
          ) {
            tileset.style = new Cesium.Cesium3DTileStyle(
              extras.ion.defaultStyle
            );
          }
        })
        .otherwise(function(error) {
          console.log(error);
        });

      tileset.maximumScreenSpaceError = 16.0;
      tileset.pointCloudShading.maximumAttenuation = 4.0; // Don't allow points larger than 4 pixels.
      tileset.pointCloudShading.baseResolution = 0.05; // Assume an original capture resolution of 5 centimeters between neighboring points.
      tileset.pointCloudShading.geometricErrorScale = 0.5; // Applies to both geometric error and the base resolution.
      tileset.pointCloudShading.attenuation = true;
      tileset.pointCloudShading.eyeDomeLighting = true;
      //高度*******************************************************************
      //*******************************************************************
      //*******************************************************************
      let offset_height = 1.0;
      var cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      );
      var surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0.0
      );
      var offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        offset_height
      );
      var translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      );
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

      //*******************************************************************
      //*******************************************************************
      //*******************************************************************

      var boundingSphere = tileset.boundingSphere;
      var radius = boundingSphere.radius;

      viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4.0)
      );

      if (
        !Cesium.Matrix4.equals(tileset.root.transform, Cesium.Matrix4.IDENTITY)
      ) {
        // The clipping plane is initially positioned at the tileset's root transform.
        // Apply an additional matrix to center the clipping plane on the bounding sphere center.
        var transformCenter = Cesium.Matrix4.getTranslation(
          tileset.root.transform,
          new Cesium.Cartesian3()
        );
        var transformCWartographic = Cesium.Cartographic.fromCartesian(
          transformCenter
        );
        var boundingSphereCartographic = Cesium.Cartographic.fromCartesian(
          tileset.boundingSphere.center
        );

        var height =
          boundingSphereCartographic.height - transformCWartographic.height;
        // clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(
          new Cesium.Cartesian3(0.0, 0.0, 0.0)
        // );
      }


      return tileset;
    })
    .otherwise(function(error) {
      console.log(error);
    });
}

// Power Plant design model provided by Bentley Systems

// var layer = Cesium.IonResource.fromAssetId(275559);

// loadTileset(layer);

// Track and create the bindings for the view model
// var toolbar = document.getElementById("toolbar");
// Cesium.knockout.track(viewModel);
// // Cesium.knockout.applyBindings(viewModel, toolbar);
// var tileset;
////////////////////////////////////////////////////////////////////
