import CoverImageUploader from '@components/CoverImageUploader';
import { memo, useEffect, useState } from 'react';
import { CoverImageSectionProps } from './CoverImageSection.type';
import { RequestInit } from '@apis/api.type';
import apis from '@apis/index';
import useFetch from '@hooks/fetch.hook';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import UrlUtils from '@utilities/url.util';

function CoverImageSection({ storyId }: CoverImageSectionProps) {
  const { data: storyData, setRefetch: setReGetStory } = useFetch<
    [Story[], number]
  >(apis.storyApi.getStoryWithFilter, {
    queries: {
      id: storyId,
      page: 1,
      limit: 1,
    },
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [getPreUploadUrlRequest, setGetPreUploadUrlRequest] =
    useState<RequestInit>();
  const {
    data: getPreUploadCoverImageUrlResData,
    isLoading: isGetingPreUploadCoverImageUrl,
    setRefetch: setReGetPreUploadCoverImageUrl,
  } = useFetch(apis.uploadApi.getUploadUrl, getPreUploadUrlRequest, false);
  const [uploadCoverImageRequest, setUploadCoverImageRequest] =
    useState<RequestInit>();
  const { setRefetch: setReUploadCoverImage } = useFetch(
    apis.uploadApi.upload,
    uploadCoverImageRequest,
    false
  );
  const [updateStoryReq, setUpdateStoryReq] = useState<RequestInit>({
    params: {
      storyId,
    },
  });
  const { setRefetch: setReUpdateStory } = useFetch(
    apis.storyApi.updateStory,
    updateStoryReq,
    false
  );

  useEffect(() => {
    setReGetStory({
      value: true,
    });
  }, []);

  useEffect(() => {
    if (coverImageFile) {
      setGetPreUploadUrlRequest({
        queries: {
          fileType: coverImageFile.type,
        },
      });
    }
  }, [coverImageFile]);

  useEffect(() => {
    if (getPreUploadUrlRequest) {
      setReGetPreUploadCoverImageUrl({
        value: true,
      });
    }
  }, [getPreUploadUrlRequest]);

  useEffect(() => {
    if (!isGetingPreUploadCoverImageUrl) {
      if (getPreUploadCoverImageUrlResData) {
        setUploadCoverImageRequest({
          uri: getPreUploadCoverImageUrlResData.preUploadUrl,
          body: coverImageFile,
          headers: {
            'Content-Type': coverImageFile?.type || '',
          },
        });
        setUpdateStoryReq({
          ...updateStoryReq,
          body: {
            coverImage: getPreUploadCoverImageUrlResData.fileKey,
          },
        });
      }
    }
  }, [isGetingPreUploadCoverImageUrl]);

  useEffect(() => {
    if (uploadCoverImageRequest) {
      setReUploadCoverImage({
        value: true,
      });
    }
  }, [uploadCoverImageRequest]);

  useEffect(() => {
    if (updateStoryReq?.body?.coverImage) {
      setReUpdateStory({
        value: true,
      });
    }
  }, [updateStoryReq]);

  return (
    <div>
      <CoverImageUploader
        previewUrl={
          coverImageFile !== null
            ? URL.createObjectURL(coverImageFile)
            : storyData?.[0]?.[0]?.coverImage
              ? UrlUtils.generateUrl(storyData[0][0].coverImage)
              : undefined
        }
        value={coverImageFile}
        onChange={(file) => setCoverImageFile(file)}
      />
    </div>
  );
}

export default memo(CoverImageSection);
