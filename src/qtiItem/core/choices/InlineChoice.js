import QtiContainerChoice from 'taoQtiItem/qtiItem/core/choices/ContainerChoice';
import Container from 'taoQtiItem/qtiItem/mixin/ContainerInline';
var QtiInlineChoice = QtiContainerChoice.extend({
    qtiClass: 'inlineChoice'
});
Container.augment(QtiInlineChoice);
export default QtiInlineChoice;
