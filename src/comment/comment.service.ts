import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
    

    constructor(private readonly prismaservice: PrismaService) { }

    async create(userId: number, createCommentDto: CreateCommentDto) {
        const { postId, content } = createCommentDto
        const post = await this.prismaservice.post.findUnique({ where: { postId } })
        if (!post) throw new NotFoundException("Post not found")
        await this.prismaservice.comment.create({
            data: {
                content,
                userId,
                postId
            },
        });

        return { data: "comment created!" }
    }
    async delete(commentId: number, userId: number, postId: number) {
        const comment = await this.prismaservice.comment.findFirst({ where: { commentId } })
        if (!comment) throw new NotFoundException("Comment not found");
        if (comment.postId != postId) throw new UnauthorizedException("Post Id does not match");
        if (comment.userId != userId) throw new ForbiddenException("forbidden action");
        await this.prismaservice.comment.delete({ where: { commentId } });
        return { data: 'comment deleted!' };
    }

    async update(commentId: number, userId: any, UpdateCommentDto: UpdateCommentDto) {
        const {content, postId} = UpdateCommentDto
        const comment = await this.prismaservice.comment.findFirst({ where: { commentId } })
        if (!comment) throw new NotFoundException("Comment not found");
        if (comment.postId != postId) throw new UnauthorizedException("Post Id does not match");
        if (comment.userId != userId) throw new ForbiddenException("forbidden action");
        await this.prismaservice.comment.update({where: {commentId}, data : {content}})
        return {data: "comment updated!"}
    }
}
