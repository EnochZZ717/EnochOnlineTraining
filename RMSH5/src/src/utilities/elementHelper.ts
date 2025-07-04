export const findTargetParentElement = (e: any, name: string) => {
    let ele = e?.parentElement;
    if(e && !e?.parentElement?.className.includes(name)){
        ele = findTargetParentElement(e.parentElement, name);
    }
    return ele;
}