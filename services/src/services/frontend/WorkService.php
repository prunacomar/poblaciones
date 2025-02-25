<?php

namespace helena\services\frontend;

use minga\framework\PublicException;
use helena\entities\frontend\work\WorkInfo;
use helena\entities\frontend\metadata\MetadataInfo;
use helena\services\backoffice\publish\PublishDataTables;

use helena\services\common\BaseService;
use helena\classes\Links;
use helena\db\frontend\MetadataModel;
use helena\db\frontend\WorkModel;
use helena\db\frontend\FileModel;
use helena\classes\App;
use helena\classes\Session;
use helena\entities\frontend\geometries\Envelope;

class WorkService extends BaseService
{
	public function GetWork($workId)
	{
		$worksTable = new WorkModel();
		$ret = $this->GetWorkOnly($workId);
		$rows = $worksTable->GetWorkMetricsInfo($workId);
		$ret->FillMetrics($rows);
		$metadataTable = new MetadataModel();
		$rows = $metadataTable->GetMetadataFiles($ret->Metadata->Id);
		$ret->Metadata->FillFiles($rows);
		return $ret;
	}

	public function GetWorkOnly($workId)
	{
		$worksTable = new WorkModel();
		$work = $worksTable->GetWork($workId);
		if (!$work) {
			throw new PublicException("La cartografía no ha sido encontrada.");
		}
		$ret = new WorkInfo();
		$workIdUnShardified = PublishDataTables::Unshardify($workId);
		$ret->CanEdit = Session::IsWorkEditor($workIdUnShardified);
		$ret->Fill($work);
		$ret->FillStartup($work);
		if ($work['met_extents'])
			$ret->Extents = Envelope::FromDb($work['met_extents'])->Trim();

		$ret->Url = Links::GetFullyQualifiedUrl($ret->Url);
		$ret->Metadata = new MetadataInfo();
		$ret->Metadata->Fill($work);
		$ret->Metadata->FillInstitution($work);

		return $ret;
	}

	public function GetWorkImage($workId)
	{
		$work = $this->GetWorkOnly($workId);
		$fileId = $work->ImageId;
		$fileModel = new FileModel();
		return $fileModel->SendFile($fileId);
	}
	public function GetWorkByMetricVersion($metricVersionId)
	{
		$worksTable = new WorkModel();
		$work = $worksTable->GetWorkByMetricVersion($metricVersionId);
		if (!$work)
			// La versión no tiene levels
			return null;
		$ret = new WorkInfo();
		$ret->Fill($work);
		$ret->Metadata = new MetadataInfo();
		$ret->Metadata->Fill($work);
		// Hace absolute la URL
		$ret->Url = Links::GetFullyQualifiedUrl($ret->Url);
		$metadataTable = new MetadataModel();
		$rows = $metadataTable->GetMetadataFiles($ret->Metadata->Id);
		$ret->Metadata->FillFiles($rows);
		return $ret;
	}
}

