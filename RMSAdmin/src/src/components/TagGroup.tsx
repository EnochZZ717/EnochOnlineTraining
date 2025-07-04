import { Col, Row, Tag, Tooltip } from "antd";
import { ITagGroupRspModel, ITagRspModel } from "models";
import { FunctionComponent } from "react";
import { ConfirmModal } from "./ConfirmModal";
import { TagInput } from "./TagInput";

export const TagGroup : FunctionComponent<{currentTagGroup: ITagGroupRspModel | undefined, tagType: string, handleAdd: any, handleGroupDelete : any, handleTagDelete: any }> 
= ({currentTagGroup, tagType, handleAdd, handleGroupDelete, handleTagDelete}) => {

  const handleInputChange = (newValue: string) => {
    const tag : ITagRspModel = {
      name: newValue,
      description: newValue,
      tagType: tagType,
      displayInFilter: tagType === "User" ? false : true
    }

    handleAdd(currentTagGroup, tag)
  }

  const handleGroupDeleteConfirm = (e: React.MouseEvent, tagGroup: ITagGroupRspModel) => {
    e.preventDefault()
    ConfirmModal({
      title: "是否删除标签组", 
      confirm: ()=> handleGroupDelete(tagGroup)
    })
  }

  const handleTagDeleteConfirm = (e: React.MouseEvent, tag: ITagRspModel) => {
    e.preventDefault()
    ConfirmModal({
      title: "是否删除标签", 
      confirm: ()=> handleTagDelete(tag)
    })
  }

  const tagElements = (tags: ITagRspModel[]) => {
    if(tags) {
      return (
        tags.map((tag, index) => {
          const isLongTag = tag.name.length > 20;
  
          const tagElem = (
            <Tag
              style={{marginTop: 2}}
              key = {index}
              closable={true}
              onClose={(e) => handleTagDeleteConfirm(e, tag)}
            >
              {isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag.name} key={index}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })
      )
    }    
  }

  return (
    <Row style={{margin: 20}}>
      <Col span={24}>
        {
          currentTagGroup?.name && currentTagGroup.name !== "用户" && 
          <Row style={{marginBottom: 20}}>
            <Col>
              <Tag
                closable={true}
                onClose={(e)=> handleGroupDeleteConfirm(e, currentTagGroup)}
              >
                {currentTagGroup?.name}
              </Tag>
            </Col>
          </Row>
        }      
        <Row>
          <Col offset={2} span={18}>
            {
              tagElements(currentTagGroup?.tags!)
            }
          </Col>
          <Col span={4} style={{marginTop: 2}}>
            <TagInput plusLabel="标签" change={handleInputChange} />
          </Col>
        </Row>
      </Col>          
    </Row>
  );
}
