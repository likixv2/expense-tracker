from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.group import Group, GroupMember
from app.models.user import User
from app.schemas.group import (
    GroupCreate,
    GroupDetail,
    GroupMemberAdd,
    GroupOut,
)

router = APIRouter(
    prefix="/groups",
    tags=["Groups"],
)


@router.post("", response_model=GroupOut)
def create_group(
    payload: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = Group(
        name=payload.name,
        created_by=current_user.id,
    )

    db.add(group)
    db.commit()
    db.refresh(group)

    membership = GroupMember(
        group_id=group.id,
        user_id=current_user.id,
    )

    db.add(membership)
    db.commit()

    return group


@router.get("/{group_id}", response_model=GroupDetail)
def get_group(
    group_id: int,
    db: Session = Depends(get_db),
):
    group = (
        db.query(Group)
        .filter(Group.id == group_id)
        .first()
    )

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found",
        )

    members = (
        db.query(User)
        .join(GroupMember)
        .filter(GroupMember.group_id == group_id)
        .all()
    )

    return {
        "id": group.id,
        "name": group.name,
        "created_by": group.created_by,
        "members": members,
    }


@router.post("/{group_id}/members")
def add_member(
    group_id: int,
    payload: GroupMemberAdd,
    db: Session = Depends(get_db),
):
    group = (
        db.query(Group)
        .filter(Group.id == group_id)
        .first()
    )

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found",
        )

    user = (
        db.query(User)
        .filter(User.id == payload.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    existing = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == payload.user_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User is already a member",
        )

    membership = GroupMember(
        group_id=group_id,
        user_id=payload.user_id,
    )

    db.add(membership)
    db.commit()

    return {
        "message": "Member added successfully"
    }