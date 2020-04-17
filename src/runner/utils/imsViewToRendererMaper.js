const getRendererNameFromView = function(imsView) {
    let renderer = '';

    if (imsView === 'scorer') {
        renderer = 'reviewRenderer';
    } else {
        renderer = 'commonRenderer';
    }

    return renderer;
}

export default getRendererNameFromView;