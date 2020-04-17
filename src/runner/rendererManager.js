import providerRegistry from 'core/providerRegistry';
import qtiRenderer from 'taoQtiItem/qtiCommonRenderer/renderers/rendererProvider';
import reviewRenderer from 'taoQtiItem/reviewRenderer/renderers/rendererProvider';

export default function rendererManager(rendererName) {
    const name = rendererName || 'commonRenderer';
    const renderer = rendererManager.getProvider(name);

    return {
        init() {
            renderer.init.call(this);
            return this;
        },
        getRenderer() {
            return renderer.getRenderer();
        }
    };
}

providerRegistry(rendererManager);

rendererManager.registerProvider(qtiRenderer.name, qtiRenderer);
rendererManager.registerProvider(reviewRenderer.name, reviewRenderer);
