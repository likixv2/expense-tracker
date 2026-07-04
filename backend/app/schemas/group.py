from typing import List

from pydantic import BaseModel

from app.schemas.user import UserOut


class GroupCreate(BaseModel):
    name: str


class GroupOut(BaseModel):
    id: int
    name: str
    created_by: int

    class Config:
        from_attributes = True


class GroupMemberAdd(BaseModel):
    user_id: int


class GroupDetail(GroupOut):
    members: List[UserOut] = []